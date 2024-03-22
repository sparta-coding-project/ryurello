import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import { EmailValid } from 'src/entities/types/userValid.type';
import { JwtService } from '@nestjs/jwt';

config();

@Injectable()
export class GoogleService extends PassportStrategy(Strategy, 'google') {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async googleLogin(req) {
    if (!req.user) {
      throw new UnauthorizedException('잘못된 요청입니다.');
    }
    let user = await this.userRepository.findOneBy({
      email: req.user.email,
    });
    if (!user) {
      const newUser = await this.userRepository.save({
        email: req.user.email,
        nickName: req.user.name,
        profileImage: req.user.picture,
        emailValid: EmailValid.Permitted,
      });
      user = newUser;
    }

    const payload = { email: user.email, sub: user.userId };
    const accessToken = this.jwtService.sign(payload);
    return { access_token: accessToken, user };
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { displayName, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      name: displayName,
      picture: photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}
