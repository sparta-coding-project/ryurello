import {
  BadRequestException,
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
import { AwsService } from 'src/utils/aws/aws.service';
import { EmailValid } from 'src/entities/types/userValid.type';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly awsService: AwsService,
    private readonly mailService: MailService,
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
    await this.sendMail(newUser.userId, newUser.email);

    return newUser;
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOne({
      select: ['userId', 'email', 'password', 'emailValid'],
      where: { email },
    });
    if (user.emailValid === '메일 인증 안됨') {
      throw new UnauthorizedException('메일 인증을 완료해 주세요');
    }
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

  async sendMail(userId: number, to: string) {
    const user = await this.findOne(userId);
    const subject = 'Ryurello - 회원가입을 환영합니다.';
    const url = `http://${process.env.INVITE_URL}/user/validation/${userId}?email=${to}`;
    const content = `<p> ryurello에 가입하신 걸 환영합니다..<p>
    <p>아래 링크를 눌러 초대를 수락할 수 있습니다.<p>
    <a href="${url}">수락하기</a>`;
    await this.mailService.sendMail(to, subject, content);
  }

  async validateUserByEmail(userId: number, email: string) {
    const user = await this.userRepository.findOneBy({ userId, email });
    if (_.isNil(user)) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    user.emailValid = EmailValid.Permitted;
    await this.userRepository.save(user);
    return { user };
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

  async uploadImage(image: Express.Multer.File, id: number) {
    if (!image) {
      throw new BadRequestException('파일이 전송되지 않았습니다.');
    }
    const user = await this.userRepository.findOne({
      where: { userId: id },
    });
    if (_.isNil(user)) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    const ext = image.originalname.split('.')[1];
    const imageName = image.originalname.split('.')[0];
    const imageUrl = await this.awsService.imageUploadToS3(
      `${imageName}.${ext}`,
      image,
      ext,
    );

    user.profileImage = imageUrl;

    await this.userRepository.save(user);

    return { imageUrl };
  }

  async deleteImage(id) {
    const user = await this.userRepository.findOneBy({ userId: id });
    if (!user) {
      throw new NotFoundException('해당 사용자가 존재하지 않습니다.');
    }
    if (!user.profileImage) {
      throw new NotFoundException('삭제할 프로필 이미지가 없습니다.');
    }
    try {
      const key = user.profileImage.split('/')[4];

      await this.awsService.deleteS3Object(key);
      user.profileImage = null;
      await this.userRepository.save(user);

      return { message: '성공적으로 삭제하셨습니다.' };
    } catch (err) {
      throw new Error(err);
    }
  }

  async delete(userId: number) {
    const user = await this.userRepository.findOne({
      where: { userId },
    });
    if (_.isNil(user)) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    await this.userRepository.delete({ userId });

    return { message: '성공적으로 삭제되었습니다.' };
  }
}
