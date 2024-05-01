import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ServiceAccount } from 'firebase-admin';
import * as firebaseAdmin from 'firebase-admin';
import * as firebaseConfig from '../firebase-admin.json';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    },
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api/v1');

  const firebaseAdminConfig: ServiceAccount = {
    projectId: firebaseConfig.project_id,
    privateKey: firebaseConfig.private_key.replace(/\\n/g, '\n'),
    clientEmail: firebaseConfig.client_email,
  };

  // Initialize the firebase admin app
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(firebaseAdminConfig),
    databaseURL: 'https://xxxxx.firebaseio.com',
  });

  // initialize the swagger module
  const config = new DocumentBuilder()
    .setTitle('Prompt App')
    .setDescription('The Prompt app API description')
    .setVersion('0.1')
    .addTag('Prompt app')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.HTTP_PORT, () => {
    console.log('server is running on port: ', process.env.HTTP_PORT);
  });
}
bootstrap();
