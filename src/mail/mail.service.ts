import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      pool: true,
      service: process.env.MAIL_SERVICE,
      host: process.env.MAIL_HOST,
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.MAIL_USER, // 보내는 사람 이메일
        pass: process.env.MAIL_PASS, // 비밀번호
      },
      tls: { rejectUnauthorized: false },
    });
  }

  async sendMail(to: string, subject: string, content: string) {
    try {
      console.log("메일메일메일메일",to,subject,content)
      await this.transporter.sendMail({
        from: process.env.MAIL_USER,
        to: to, //배열 가능
        subject: subject,
        html: content,
      });
      console.log('메일이 전송되었습니다');
    } catch (error) {
      console.error('메일 전송 중 오류가 발생했습니다:', error);
    }
  }
}
