import { PickType } from '@nestjs/swagger';
import { SignUpDto } from './signUp.dto';

export class LoginDto extends PickType(SignUpDto, ['email', 'password']) {}
