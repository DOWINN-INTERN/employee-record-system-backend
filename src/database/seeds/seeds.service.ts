import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAccess } from 'src/modules/auth/entity/user-access.entity';
import { UserStatus } from 'src/modules/auth/entity/user-status.entity';
import { EnUserAccess } from 'src/modules/auth/enum/user-access.enum';
import { EnUserStatus } from 'src/modules/auth/enum/user-status.enum';
import { RequirementType } from 'src/modules/requirements/entity/requirement-type.entity';
import { EnRequirementType } from 'src/modules/requirements/enum/requirements.enum';
import { Repository } from 'typeorm';

@Injectable()
export class SeedsService {
  constructor(
    @InjectRepository(UserAccess) private userAccesRepo: Repository<UserAccess>,
    @InjectRepository(UserStatus) private userStatusRepo: Repository<UserStatus>,
    @InjectRepository(RequirementType) private requirementTypeRepo: Repository<RequirementType>,
  ) {}

  async generateUserAccessTableContent(): Promise<string> {
    try {
      const userAccessArray = Object.values(EnUserAccess);

      for (const ua of userAccessArray) {
        const access = this.userAccesRepo.create({ name: ua });
        await this.userAccesRepo.save(access);
      }

      return 'user_access seed completed.';
    } catch (error) {
      return 'user_access seed failed: ' + error.code;
    }
  }

  async generateUserStatusTableContent(): Promise<string> {
    try {
      const userStatusArray = Object.values(EnUserStatus);

      for (const us of userStatusArray) {
        const status = this.userStatusRepo.create({ name: us });
        await this.userStatusRepo.save(status);
      }

      return 'user_status seed completed.';
    } catch (error) {
      return 'user_status seed failed: ' + error.code;
    }
  }

  async generateRequirementTypeTableContent(): Promise<string> {
    try {
      const requirementTypeArray = Object.values(EnRequirementType);

      for (const rt of requirementTypeArray) {
        const type = this.requirementTypeRepo.create({ name: rt });
        await this.requirementTypeRepo.save(type);
      }

      return 'requirement_type seed completed.';
    } catch (error) {
      return 'requirement_type seed failed: ' + error.code;
    }
  }
}
