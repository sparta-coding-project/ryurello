import { IsNumber } from "class-validator";

export class CreateCardUserDto {
  @IsNumber()
  buId: number;

  @IsNumber()
  cardId: number;
}
