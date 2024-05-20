import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ExternalIpService {
  constructor(private readonly httpService: HttpService) {}

  private readonly logger = new Logger(ExternalIpService.name);

  async getExternalIp(): Promise<string> {
    const urls = ['https://ipinfo.io/ip', 'http://ifconfig.io/ip', 'http://whatismyip.akamai.com/'];

    for (const url of urls) {
      try {
        const response = await firstValueFrom(this.httpService.get(url));
        const ip = response.data.trim();

        if (ip) {
          return ip;
        }
      } catch (error) {
        this.logger.debug(`Site '${url}' does not return an IP.`);
      }
    }

    this.logger.debug('Failed to get external IPs.');
    return '';
  }
}
