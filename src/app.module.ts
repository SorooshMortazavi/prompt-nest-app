import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PromptModule } from './prompt/prompt.module';
import * as Joi from 'joi';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT: Joi.number().required(),
        NODE_ENV: Joi.string().required(),
        REDIS_URL: Joi.string().required(),
        SERVER_URL: Joi.string().required(),
      }),
    }),
    PromptModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
