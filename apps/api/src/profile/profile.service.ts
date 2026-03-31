import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../database/database.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly db: DatabaseService) {}

  async getProfile(userId: string) {
    const user = await this.db.queryOne<any>(
      `SELECT u.id, u.email, u.name, u.role, u.phone, u.bio, u.avatarUrl,
              u.emailVerified, u.twoFactorEnabled, u.isApprovedInstructor,
              u.locale, u.currency, u.createdAt,
              (SELECT COUNT(*) FROM Course c WHERE c.instructorId = u.id) as courseCount,
              (SELECT COUNT(*) FROM Enrollment e WHERE e.userId = u.id) as enrollmentCount,
              (SELECT COUNT(*) FROM Review r WHERE r.userId = u.id) as reviewCount,
              (SELECT COUNT(*) FROM Certificate cert WHERE cert.userId = u.id) as certificateCount
       FROM User u WHERE u.id = ?`,
      [userId],
    );

    if (!user) throw new NotFoundException('User not found');

    return {
      ...user,
      emailVerified: !!user.emailVerified,
      twoFactorEnabled: !!user.twoFactorEnabled,
      isApprovedInstructor: !!user.isApprovedInstructor,
      _count: {
        courses: Number(user.courseCount),
        enrollments: Number(user.enrollmentCount),
        reviews: Number(user.reviewCount),
        certificates: Number(user.certificateCount),
      },
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const sets: string[] = [];
    const params: any[] = [];
    if (dto.name !== undefined) { sets.push('name = ?'); params.push(dto.name); }
    if (dto.phone !== undefined) { sets.push('phone = ?'); params.push(dto.phone); }
    if (dto.bio !== undefined) { sets.push('bio = ?'); params.push(dto.bio); }
    if (dto.avatarUrl !== undefined) { sets.push('avatarUrl = ?'); params.push(dto.avatarUrl); }
    if (dto.locale !== undefined) { sets.push('locale = ?'); params.push(dto.locale); }
    if (dto.currency !== undefined) { sets.push('currency = ?'); params.push(dto.currency); }

    if (sets.length > 0) {
      sets.push('updatedAt = NOW()');
      params.push(userId);
      await this.db.execute(`UPDATE User SET ${sets.join(', ')} WHERE id = ?`, params);
    }

    return this.db.queryOne(
      'SELECT id, email, name, role, phone, bio, avatarUrl, locale, currency FROM User WHERE id = ?',
      [userId],
    );
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.db.queryOne<any>(
      'SELECT password FROM User WHERE id = ?',
      [userId],
    );
    if (!user) throw new NotFoundException('User not found');

    const isValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
    await this.db.execute(
      'UPDATE User SET password = ?, updatedAt = NOW() WHERE id = ?',
      [hashedPassword, userId],
    );

    return { message: 'Password changed successfully' };
  }

  async requestPasswordReset(email: string) {
    const user = await this.db.queryOne<any>(
      'SELECT id FROM User WHERE email = ?',
      [email.toLowerCase()],
    );
    if (!user) {
      return { message: 'If the email exists, a reset link has been sent' };
    }

    const token = `reset-${Date.now()}-${Math.random().toString(36).substring(2)}`;
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await this.db.execute(
      'UPDATE User SET passwordResetToken = ?, passwordResetExpires = ?, updatedAt = NOW() WHERE id = ?',
      [token, expires, user.id],
    );

    return { message: 'If the email exists, a reset link has been sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.db.queryOne<any>(
      'SELECT id FROM User WHERE passwordResetToken = ? AND passwordResetExpires >= NOW()',
      [token],
    );
    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.db.execute(
      'UPDATE User SET password = ?, passwordResetToken = NULL, passwordResetExpires = NULL, updatedAt = NOW() WHERE id = ?',
      [hashedPassword, user.id],
    );

    return { message: 'Password reset successfully' };
  }

  async verifyEmail(token: string) {
    const user = await this.db.queryOne<any>(
      'SELECT id FROM User WHERE emailVerificationToken = ?',
      [token],
    );
    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    await this.db.execute(
      'UPDATE User SET emailVerified = 1, emailVerificationToken = NULL, updatedAt = NOW() WHERE id = ?',
      [user.id],
    );

    return { message: 'Email verified successfully' };
  }

  async toggleTwoFactor(userId: string, enable: boolean) {
    const secret = enable
      ? `2fa-${Date.now()}-${Math.random().toString(36).substring(2)}`
      : null;

    await this.db.execute(
      'UPDATE User SET twoFactorEnabled = ?, twoFactorSecret = ?, updatedAt = NOW() WHERE id = ?',
      [enable ? 1 : 0, secret, userId],
    );

    return {
      twoFactorEnabled: enable,
      ...(enable ? { secret } : {}),
    };
  }
}
