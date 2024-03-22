import { PartialType } from '@nestjs/swagger';
import { CreateCardUserDto } from './create-card-user.dto';

export class UpdateCardUserDto extends PartialType(CreateCardUserDto) {}
