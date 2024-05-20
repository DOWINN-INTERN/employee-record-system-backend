import { Injectable, UnprocessableEntityException } from '@nestjs/common';

@Injectable()
export class StringHelper {
  async firstLetterCase(args: string): Promise<string> {
    if (!args || typeof args !== 'string') {
      throw new UnprocessableEntityException();
    }

    const separators = [' ', '.', ',', '-', '_'];
    let lettercase = args.toLowerCase();

    separators.forEach((sep) => {
      if (lettercase.includes(sep)) {
        const base = lettercase.split(sep).filter(Boolean);
        const collect = base.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
        lettercase = collect.join(sep);
      }
    });

    lettercase = lettercase.charAt(0).toUpperCase() + lettercase.slice(1);
    return lettercase;
  }

  async createAlias(args: string): Promise<string> {
    if (!args || typeof args !== 'string') {
      throw new UnprocessableEntityException();
    }

    return args.replace(/[^\p{L}\p{N}]+/gu, '-').toLowerCase();
  }

  async stringMetrics(args: string): Promise<string> {
    if (!args || typeof args !== 'string') {
      throw new UnprocessableEntityException();
    }

    return args.replace(/[^\p{L}\p{N}]+/gu, '').toLowerCase();
  }
}
