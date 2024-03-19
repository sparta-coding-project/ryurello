import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send')
  async sendMail(
    @Body('to') to: string,
    @Body('subject') subject: string,
    @Body('content') content: string,
  ) {
    await this.mailService.sendMail(to, subject, content);
    return {
      statusCode: HttpStatus.OK,
      message: '메일 발송됨',
    };
  }
}
