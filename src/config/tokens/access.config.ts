import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const acccessConfig = async (configService: ConfigService): Promise<JwtModuleOptions> => {
  return {
    secret: configService.get<string>('ACCESS_SECRET'),
    signOptions: { expiresIn: '60000' }, // 1 minute (60000) - value must be in ms only.
  };
};
