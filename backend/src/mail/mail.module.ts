// src/mail/mail.module.ts

import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAIL_HOST'), // e.g., 'smtp.gmail.com'
          port: configService.get('MAIL_PORT'), // e.g., 587 or 465
          secure: configService.get('MAIL_SECURE') === 'true',
          auth: {
            user: configService.get('MAIL_USER'),
            pass: configService.get('MAIL_PASS'),
          },
        },
        defaults: {
          from: `"Finance Platform" <${configService.get('MAIL_USER')}>`,
        },
      }),
    }),
    ConfigModule,
  ],
  providers: [MailService],
  exports: [MailService], // Make MailService available to other modules (like AuthModule)
})
export class MailModule {}