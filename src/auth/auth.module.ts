import { Module } from '@nestjs/common';
import { FirebaseStrategy } from './firebase-auth.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'firebase-jwt' })],
  providers: [FirebaseStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
