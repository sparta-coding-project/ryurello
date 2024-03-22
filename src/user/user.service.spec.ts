import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';
import { User } from '../../src/entities/users.entity';
import { Repository } from 'typeorm';

describe('UserService', () => {
  let service: UserService;
  let userRepositoryMock: Partial<Record<keyof Repository<User>, jest.Mock>>;
  let jwtServiceMock: Partial<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const newUser = {
    email: 'test@example.com',
    password: 'password',
    nickName: 'testUser',
  };
  const SignUser = {
    email: 'test@example.com',
    password: 'password',
    nickName: 'testUser',
    passwordConfirm: 'password',
  };

  describe('register', () => {
    it('should register a new user', async () => {
      jest.spyOn(userRepositoryMock, 'findOne').mockResolvedValueOnce(null);
      jest
        .spyOn(userRepositoryMock, 'save')
        .mockResolvedValueOnce(newUser as User);

      const result = await service.register(SignUser);

      expect(result).toEqual(newUser);
    });

    it('should throw ConflictException if user already exists', async () => {
      const existingUser = {
        email: 'test@example.com',
        password: 'password',
        nickName: 'testUser',
      };
      jest
        .spyOn(userRepositoryMock, 'findOne')
        .mockResolvedValueOnce(newUser as User);

      await expect(service.register(SignUser)).rejects.toThrowError(Error);
    });
  });
});
