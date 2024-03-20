import { Module } from '@nestjs/common';
import { CardUsersService } from './card-users.service';
import { CardUsersController } from './card-users.controller';

@Module({
  controllers: [CardUsersController],
  providers: [CardUsersService],
})
export class CardUsersModule {}
