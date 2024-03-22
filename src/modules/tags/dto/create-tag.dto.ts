import { IsHexColor, IsNumber, IsString } from "class-validator"

export class CreateTagDto {
  @IsNumber()
  cardId:number

  @IsString()
  title: string

  @IsHexColor()
  bgColor: string
}
