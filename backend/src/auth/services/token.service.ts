/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt.interface';

@Injectable()
export class TokenService {
  private readonly secret: string;
  private readonly expiresIn: string;

  constructor(private configService: ConfigService) {
    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    this.secret = secret;
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN');
    if (!expiresIn) {
      throw new Error('JWT_EXPIRES_IN is not defined in environment variables');
    }
    this.expiresIn = expiresIn;
  }

  generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
    console.log('JWT_SECRET:', this.secret);
    console.log('JWT_EXPIRES_IN:', this.expiresIn);
    try {
      return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
    } catch (error) {
      throw new UnauthorizedException('Failed to generate token');
    }
  }

  verifyToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, this.secret) as JwtPayload;
      return decoded;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new UnauthorizedException('Invalid token');
      }
      throw new UnauthorizedException('Token verification failed');
    }
  }

  decodeToken(token: string): JwtPayload | null {
    try {
      return jwt.decode(token) as JwtPayload;
    } catch {
      return null;
    }
  }

  extractTokenFromHeader(authHeader: string): string {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid authorization header',
      );
    }
    return authHeader.substring(7);
  }
}
