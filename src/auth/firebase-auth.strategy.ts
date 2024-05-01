// src/firebase-auth/firebase.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-firebase-jwt';
import { auth } from 'firebase-admin';
import { ValidUserDto } from './dto/valid-user.dto';

@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(token: string): Promise<ValidUserDto> {
    try {
      //this work only on development mode.
      if (process.env.NODE_ENV.trim() === 'development') {
        return {
          uid: 'uidForThisUser',
        };
      }
      const user: ValidUserDto = await auth().verifyIdToken(token);
      if (!user) {
        throw new UnauthorizedException();
      }
      return user;
    } catch (e) {
      console.log('error', e.message);
      throw new UnauthorizedException();
    }
  }
}
