import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import { UserToken } from 'src/modules/auth/entity/user-token.entity';
import { LessThan, Repository } from 'typeorm';

@Injectable()
export class CleanTokenService {
  constructor(@InjectRepository(UserToken) private tokenRepo: Repository<UserToken>) {}

  private readonly logger = new Logger(CleanTokenService.name);

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    this.logger.debug('Delete tokens about to expire in 5 mins.');

    const expiryDate = DateTime.now().plus({ minutes: 5 }).toJSDate();

    await this.tokenRepo.delete({ expiresAt: LessThan(expiryDate) });
  }
}
