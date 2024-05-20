import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import * as FormData from 'form-data';
import { EMPTY, catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class CloudflareService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  private readonly logger = new Logger(CloudflareService.name);

  async uploadURL(): Promise<string> {
    const id = this.configService.get<string>('CLOUDFLARE_ACCOUNT_ID');
    const email = this.configService.get<string>('CLOUDFLARE_REQUEST_EMAIL');
    const token = this.configService.get<string>('CLOUDFLARE_API_TOKEN');
    const url = `https://api.cloudflare.com/client/v4/accounts/${id}/images/v1/direct_upload`;

    const headers = {
      'X-Auth-Email': email,
      'X-Auth-Key': token,
      'Content-Type': 'application/json',
    };

    try {
      const { data } = await firstValueFrom(
        this.httpService.post(url, {}, { headers }).pipe(
          catchError((_error: AxiosError) => {
            return EMPTY;
          }),
        ),
      );

      return data.result.uploadURL;
    } catch (error) {
      this.logger.debug('Failed to get upload URL.');
    }
  }

  async imageUpload(file: Express.Multer.File, filename: string): Promise<InUploadData> {
    const baseURL = 'http://localhost:3000';
    const apiURL = `${baseURL}/api/image/url`;

    const response = await firstValueFrom(this.httpService.get(apiURL));
    const uploadURL = response.data;

    if (uploadURL) {
      const formData = new FormData();
      formData.append('file', file.buffer, { filename: `${filename}`, contentType: file.mimetype });

      try {
        const { data } = await firstValueFrom(
          this.httpService.post(uploadURL, formData, { headers: { ...formData.getHeaders() } }).pipe(
            catchError((_error: AxiosError) => {
              return EMPTY;
            }),
          ),
        );

        return { id: data.result.id, variants: data.result.variants };
      } catch (error) {
        this.logger.debug('Failed to upload image in cloud.');
      }
    }
  }

  async imageDelete(imageId: string): Promise<string> {
    const id = this.configService.get<string>('CLOUDFLARE_ACCOUNT_ID');
    const email = this.configService.get<string>('CLOUDFLARE_REQUEST_EMAIL');
    const token = this.configService.get<string>('CLOUDFLARE_API_TOKEN');
    const url = `https://api.cloudflare.com/client/v4/accounts/${id}/images/v1/${imageId}`;

    const headers = {
      'X-Auth-Email': email,
      'X-Auth-Key': token,
      'Content-Type': 'application/json',
    };

    try {
      const { data } = await firstValueFrom(
        this.httpService.delete(url, { headers }).pipe(
          catchError((_error: AxiosError) => {
            return EMPTY;
          }),
        ),
      );

      return data;
    } catch (error) {
      this.logger.debug('Failed to delete image in cloud.');
    }
  }
}
