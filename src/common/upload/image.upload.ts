import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { extname } from 'path';

@Injectable()
export class ImageUpload {
  async validate(file: Express.Multer.File): Promise<void> {
    if (!file) {
      throw new UnprocessableEntityException();
    }

    let valid: boolean = false;

    // JPG > PNG > WEBP
    if (file.buffer[0] === 0xff && file.buffer[1] === 0xd8 && file.buffer[2] === 0xff) {
      valid = true;
    } else if (file.buffer[0] === 0x89 && file.buffer[1] === 0x50 && file.buffer[2] === 0x4e && file.buffer[3] === 0x47) {
      valid = true;
    } else if (file.buffer[8] === 0x57 && file.buffer[9] === 0x45 && file.buffer[10] === 0x42 && file.buffer[11] === 0x50) {
      valid = true;
    }

    if (!valid) {
      throw new UnprocessableEntityException();
    }

    const imageType = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];

    if (!imageType.includes(file.mimetype)) {
      throw new UnprocessableEntityException();
    }

    const extensions: string[] = ['.png', '.jpg', '.jpeg', '.webp'];
    const uploadextension: string = extname(file.originalname).toLowerCase();

    if (!extensions.includes(uploadextension)) {
      throw new UnprocessableEntityException();
    }

    const sizeLimit = 1;

    if (file.size / 1024 / 1024 > sizeLimit) {
      throw new UnprocessableEntityException();
    }
  }
}
