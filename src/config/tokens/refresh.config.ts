import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export const refreshConfig = async (configService: ConfigService): Promise<JwtModuleOptions> => {
  return {
    secret: configService.get<string>('REFRESH_SECRET'),
    signOptions: { expiresIn: '604800000' }, // 7 days (604800000) - value must be in ms only.
  };
};
