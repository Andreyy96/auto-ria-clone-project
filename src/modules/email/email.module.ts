import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';

import { Config, NodemailerConfig } from '../../configs/configs.type';
import { EmailService } from './email.service';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService<Config>) => ({
        transport: {
          service: 'gmail',
          auth: {
            user: configService.get<NodemailerConfig>('mailer').name,
            pass: configService.get<NodemailerConfig>('mailer').password,
          },
        },
        defaults: {
          from: 'No reply',
        },
        template: {
          dir: path.join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [EmailService],
  providers: [EmailService],
})
export class EmailModule {}
