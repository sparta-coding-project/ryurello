import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { User } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/signUp.dto';
import { JwtService } from '@nestjs/jwt';
import _ from 'lodash';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}
  async register(signUpDto: SignUpDto) {
    const existingUser = await this.userRepository.findOneBy({
      email: signUpDto.email,
    });
    if (existingUser) {
      throw new ConflictException(
        '이미 해당 이메일로 가입한 사용자가 있습니다.',
      );
    }
    const hashedPassword = await hash(signUpDto.password, 10);
    const newUser = await this.userRepository.save({
      email: signUpDto.email,
      password: hashedPassword,
      nickName: signUpDto.nickName,
    });

    return { message: '회원가입에 성공하셨습니다.' };
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      select: ['userId', 'email', 'password'],
      where: { email },
    });
    if (_.isNil(user)) {
      throw new UnauthorizedException('이메일을 확인해주세요');
    }
    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException('비밀번호를 확인해주세요');
    }

    const payload = { email, sub: user.userId };

    return { access_token: this.jwtService.sign(payload) };
  }

  async findOne(userId: number) {
    const user = await this.userRepository.findOneBy({ userId });

    if (_.isNil(user)) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return user;
  }

  async update(userId: number, updateUserDto: UpdateUserDto) {
    let { password, updatePassword, updateNickName } = updateUserDto;
    const user = await this.userRepository.findOne({
      where: { userId },
    });
    if (_.isNil(user)) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    if (!_.isNil(user.password) && !(await compare(password, user.password))) {
      throw new UnauthorizedException('비밀번호를 확인해 주세요');
    }
    const hashedPassword = await hash(updatePassword, 10);
    if (!updateNickName) {
      updateNickName = user.nickName;
    }

    const updateUser = await this.userRepository.update(
      { userId },
      { password: hashedPassword, nickName: updateNickName },
    );

    const updatedUser = await this.userRepository.findOneBy({ userId });

    return { updatedUser };
  }

  async delete(userId: number) {
    const user = await this.userRepository.findOne({
      where: { userId },
    });
    if (_.isNil(user)) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const deleteUser = await this.userRepository.delete({ userId });

    return { message: '성공적으로 삭제되었습니다.' };
  }
}
