import { Injectable } from '@nestjs/common';
import { createHmac } from 'node:crypto';

/**
 * Generates and verifies time-limited signed tokens for video streaming.
 * Tokens expire after a configurable TTL (default 4 hours).
 */
@Injectable()
export class VideoTokenService {
  private readonly secret: string;
  private readonly ttlMs: number;

  constructor() {
    this.secret = process.env.VIDEO_TOKEN_SECRET ?? process.env.JWT_SECRET ?? 'video-secret-key';
    this.ttlMs = Number(process.env.VIDEO_TOKEN_TTL_HOURS ?? 4) * 60 * 60 * 1000;
  }

  /**
   * Generate a signed token for a specific user + lecture combination.
   */
  generateToken(userId: number, lectureId: number): string {
    const expires = Date.now() + this.ttlMs;
    const payload = `${userId}:${lectureId}:${expires}`;
    const signature = this.sign(payload);
    // Base64url-encode: userId:lectureId:expires:signature
    const token = Buffer.from(`${payload}:${signature}`).toString('base64url');
    return token;
  }

  /**
   * Verify and decode a token. Returns { userId, lectureId } or null if invalid/expired.
   */
  verifyToken(token: string): { userId: number; lectureId: number } | null {
    try {
      const decoded = Buffer.from(token, 'base64url').toString('utf8');
      const parts = decoded.split(':');
      if (parts.length !== 4) return null;

      const [userIdStr, lectureIdStr, expiresStr, signature] = parts;
      const userId = Number(userIdStr);
      const lectureId = Number(lectureIdStr);
      const expires = Number(expiresStr);

      if (isNaN(userId) || isNaN(lectureId) || isNaN(expires)) return null;

      // Check expiry
      if (Date.now() > expires) return null;

      // Verify signature
      const payload = `${userId}:${lectureId}:${expires}`;
      const expectedSig = this.sign(payload);
      if (signature !== expectedSig) return null;

      return { userId, lectureId };
    } catch {
      return null;
    }
  }

  private sign(payload: string): string {
    return createHmac('sha256', this.secret).update(payload).digest('hex');
  }
}
