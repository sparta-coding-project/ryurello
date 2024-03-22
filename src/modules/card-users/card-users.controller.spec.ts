import { Test, TestingModule } from '@nestjs/testing';
import { CardUsersController } from './card-users.controller';
import { CardUsersService } from './card-users.service';

describe('CardUsersController', () => {
  let controller: CardUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardUsersController],
      providers: [CardUsersService],
    }).compile();

    controller = module.get<CardUsersController>(CardUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
