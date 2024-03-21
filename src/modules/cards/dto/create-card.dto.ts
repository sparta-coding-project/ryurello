import { IsDate, IsString } from "class-validator"

export class CreateCardDto {
  @IsString()
  title: string

  @IsString()
  description: string

  @IsString()
  bgColor: string

  @IsDate()
  startDate: Date

  @IsDate()
  dueDate: Date
}
