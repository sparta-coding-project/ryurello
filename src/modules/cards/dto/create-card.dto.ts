import { IsDate, IsHexColor, IsString } from "class-validator"

export class CreateCardDto {
  @IsString()
  title: string

  @IsString()
  description: string

  @IsHexColor()
  bgColor: string

  @IsDate()
  startDate: Date

  @IsDate()
  dueDate: Date
}
