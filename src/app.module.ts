import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CatalogModule } from './catalog/catalog.module';
import { CommentModule } from './comment/comment.module';
import { BoardModule } from './board/board.module';
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';

import { CardsModule } from './modules/cards/cards.module';

import Joi from 'joi';
import { AuthModule } from './auth/auth.module';

const typeOrmModuleOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ({
    namingStrategy: new SnakeNamingStrategy(),
    type: 'mysql',
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PW'),
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    database: configService.get('DB_NAME'),
    entities: [__dirname + '/**/*.entity.{js,ts}'],
    synchronize: configService.get('DB_SYNC'),
    logging: configService.get('DB_LOG'),
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET_KEY: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PW: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_NAME: Joi.string().required(),
        DB_SYNC: Joi.boolean().required(),
        DB_LOG: Joi.boolean().required(),
      }),
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    CardsModule,
    BoardModule,
    UserModule,
    MailModule,
    AuthModule,
    CatalogModule,
    CommentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
