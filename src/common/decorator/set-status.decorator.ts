import { SetMetadata } from '@nestjs/common';
import { EnUserStatus } from 'src/modules/auth/enum/user-status.enum';

export const UserStatus = (status: EnUserStatus) => SetMetadata('userStatus', status);
