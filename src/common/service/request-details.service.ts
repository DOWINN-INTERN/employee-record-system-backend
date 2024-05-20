import { Injectable } from '@nestjs/common';
import * as geoip2 from 'geoip-lite2';
import { UAResult } from 'ua-parser-js';
import { ExternalIpService } from './external-ip.service';

interface InRequestDetails {
  ipAddress: string;
  location: string;
  browser: string;
  osystem: string;
  device: string;
}

@Injectable()
export class RequestDetailsService {
  constructor(private externalIpService: ExternalIpService) {}

  async getRequestDetails(userAgent: UAResult): Promise<InRequestDetails> {
    let ipAddress: string;
    let location: string;
    let browser: string;
    let osystem: string;
    let device: string;

    const externalIP = await this.externalIpService.getExternalIp();

    if (externalIP) {
      const geoIP = geoip2.lookup(externalIP);

      ipAddress = externalIP;
      location = geoIP.city + ', ' + geoIP.country;
    }

    if (userAgent) {
      browser = userAgent.browser.name;
      osystem = userAgent.os.name;
      device = userAgent.device.name;
    }

    if (!ipAddress) {
      ipAddress = '';
    }

    if (!location) {
      location = '';
    }

    if (!browser) {
      browser = '';
    }

    if (!osystem) {
      osystem = '';
    }

    if (!device) {
      device = '';
    }

    return { ipAddress, location, browser, osystem, device };
  }
}
