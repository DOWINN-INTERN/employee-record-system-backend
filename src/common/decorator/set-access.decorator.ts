import { SetMetadata } from '@nestjs/common';
import { EnUserAccess } from 'src/modules/auth/enum/user-access.enum';

export const UserAccess = (access: EnUserAccess) => SetMetadata('userAccess', access);
