import { Test, TestingModule } from '@nestjs/testing';
import { CardUsersService } from './card-users.service';

describe('CardUsersService', () => {
  let service: CardUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardUsersService],
    }).compile();

    service = module.get<CardUsersService>(CardUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
