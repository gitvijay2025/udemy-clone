import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { DatabaseService } from '../database/database.service';
import { UserRole } from '../common/enums';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly db: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.db.queryOne(
      'SELECT id FROM User WHERE email = ?',
      [dto.email.toLowerCase()],
    );
    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    const password = await bcrypt.hash(dto.password, 10);
    const role = this.toSafeRole(dto.role);

    const result = await this.db.execute(
      `INSERT INTO User (email, name, password, role, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [dto.email.toLowerCase(), dto.name, password, role],
    );
    const id = result.insertId;

    return this.buildAuthResponse({
      id,
      email: dto.email.toLowerCase(),
      name: dto.name,
      role,
    });
  }

  async login(dto: LoginDto) {
    const user = await this.db.queryOne<any>(
      'SELECT id, email, name, password, role FROM User WHERE email = ?',
      [dto.email.toLowerCase()],
    );
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    return this.buildAuthResponse(user);
  }

  async me(userId: string) {
    const user = await this.db.queryOne<any>(
      'SELECT id, email, name, role, createdAt FROM User WHERE id = ?',
      [userId],
    );
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }

  private async signToken(payload: {
    sub: string;
    email: string;
    role: string;
  }): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  /* ──────── Forgot / Reset Password ──────── */

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.db.queryOne<any>(
      'SELECT id, email FROM User WHERE email = ?',
      [dto.email.toLowerCase()],
    );

    // Always return success to avoid leaking whether the email exists
    if (!user) {
      return { message: 'If that email exists, a reset link has been generated.' };
    }

    // Delete any existing tokens for this user
    await this.db.execute('DELETE FROM password_resets WHERE userId = ?', [
      user.id,
    ]);

    // Generate a secure random token
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.db.execute(
      `INSERT INTO password_resets (userId, token, expiresAt, createdAt)
       VALUES (?, ?, ?, NOW())`,
      [user.id, token, expiresAt],
    );

    // In a real app you'd send an email here.
    // For dev purposes, log the reset link to the console.
    const resetUrl = `http://localhost:3000/auth/reset-password?token=${token}`;
    this.logger.log(`Password reset link for ${user.email}: ${resetUrl}`);

    return {
      message: 'If that email exists, a reset link has been generated.',
      // Return token in dev so it can be used without email service
      resetToken: token,
      resetUrl,
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const record = await this.db.queryOne<any>(
      `SELECT pr.id, pr.userId, pr.expiresAt, u.email, u.name, u.role
       FROM password_resets pr
       JOIN User u ON u.id = pr.userId
       WHERE pr.token = ?`,
      [dto.token],
    );

    if (!record) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    if (new Date(record.expiresAt) < new Date()) {
      // Clean up expired token
      await this.db.execute('DELETE FROM password_resets WHERE id = ?', [
        record.id,
      ]);
      throw new BadRequestException('Reset token has expired');
    }

    // Hash the new password and update
    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.db.execute(
      'UPDATE User SET password = ?, updatedAt = NOW() WHERE id = ?',
      [hashedPassword, record.userId],
    );

    // Delete used token (and any others for same user)
    await this.db.execute('DELETE FROM password_resets WHERE userId = ?', [
      record.userId,
    ]);

    return { message: 'Password has been reset successfully. You can now login.' };
  }

  private async buildAuthResponse(user: {
    id: any;
    email: string;
    name: string;
    role: string;
  }) {
    const accessToken = await this.signToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  private toSafeRole(role?: string): UserRole {
    if (role === UserRole.ADMIN) return UserRole.ADMIN;
    if (role === UserRole.INSTRUCTOR) return UserRole.INSTRUCTOR;
    return UserRole.STUDENT;
  }
}
