import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

// Extends Express's Request so req.user is typed wherever this runs
declare module 'express' {
  interface Request {
    user?: { userId: string; email: string; role: string };
  }
}

@Injectable()
export class JwtAuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or malformed Authorization header',
      );
    }
    const token = authHeader.slice('Bearer '.length).trim();
    try {
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret: process.env.JWT_SECRET,
      });
      req.user = {
        userId: payload.sub,
        email: payload.email,
        role: payload.role,
      };
      next();
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
