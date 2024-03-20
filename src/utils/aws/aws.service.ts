import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

@Injectable()
export class AwsService {
  private readonly s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    // AWS S3 클라이언트 초기화
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get('AWS_S3_SECRET_ACCESS_KEY'),
      },
    });
  }

  async imageUploadToS3(
    fileName: string,
    file: Express.Multer.File,
    ext: string,
  ): Promise<string> {
    const date = `${Date.now()}`;
    const key = `${date}+${fileName}`;

    // AWS S3에 이미지 업로드 명령 생성
    const command = new PutObjectCommand({
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: key,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: `image/${ext}`,
    });

    try {
      // 이미지 업로드 명령 실행
      await this.s3Client.send(command);
      return `https://s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${this.configService.get('AWS_S3_BUCKET_NAME')}/${key}`;
    } catch (error) {
      // 에러 처리
      console.error('Error uploading image to S3:', error);
      throw error;
    }
  }

  async deleteS3Object(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: key,
    });

    try {
      // S3 객체 삭제 명령 실행
      await this.s3Client.send(command);
    } catch (error) {
      // 에러 처리
      console.error('Error deleting S3 object:', error);
      throw error;
    }
  }
}
