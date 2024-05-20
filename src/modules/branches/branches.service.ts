import { ConflictException, Injectable, InternalServerErrorException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { DateTime } from 'luxon';
import { EnStatus } from 'src/common/enum/status.enum';
import { StringHelper } from 'src/common/helper/string.helper';
import { ImageUpload } from 'src/common/upload/image.upload';
import { DataSource, Not, Repository } from 'typeorm';
import { CloudflareService } from '../cloudflare/cloudflare.service';
import { BranchesRequestDto } from './dto/branches-request.dto';
import { BranchesResponseDto } from './dto/branches-response.dto';
import { BranchImage } from './entity/branches-image.entity';
import { Branches } from './entity/branches.entity';
import { InBranchesResponse } from './interface/branches.interface';

@Injectable()
export class BranchesService {
  constructor(
    @InjectRepository(Branches) private branchesRepo: Repository<Branches>,
    private dataSource: DataSource,
    private imageUpload: ImageUpload,
    private stringHelper: StringHelper,
    private cloudFlareService: CloudflareService,
  ) {}

  async getAllBranch(): Promise<InBranchesResponse[]> {
    // prettier-ignore
    const branches = await this.branchesRepo
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.departments', 'd')
      .leftJoinAndSelect('b.branchImage', 'i')
      .loadRelationCountAndMap('b.deptCount', 'b.departments')
      .getMany();

    return plainToInstance(BranchesResponseDto, branches);
  }

  async goSearch(branchName: string, branchStatus: string): Promise<InBranchesResponse[]> {
    if (!branchName) {
      branchName = '%';
    }

    if (!branchStatus) {
      branchStatus = 'all';
    }

    // prettier-ignore
    let branchesQuery = this.branchesRepo
      .createQueryBuilder('b')
      .leftJoinAndSelect('b.departments', 'd')
      .leftJoinAndSelect('b.branchImage', 'i')
      .loadRelationCountAndMap('b.deptCount', 'b.departments')
      .where('b.name LIKE :name', { name: `%${branchName}%` });

    if (branchStatus.toLowerCase() !== 'all') {
      branchesQuery = branchesQuery.andWhere('b.status = :status', { status: branchStatus });
    }

    const branches = await branchesQuery.getMany();

    return plainToInstance(BranchesResponseDto, branches);
  }

  async addBranch(branchesRequestDto: BranchesRequestDto, file: Express.Multer.File): Promise<InBranchesResponse> {
    const { name, address } = branchesRequestDto;

    if (!name || !address) {
      throw new UnprocessableEntityException();
    }

    if (typeof name !== 'string') {
      throw new UnprocessableEntityException();
    }

    const nameCase = await this.stringHelper.firstLetterCase(name);
    const isName = await this.branchesRepo.existsBy({ name: nameCase });

    if (isName) {
      throw new ConflictException();
    }

    const alias = await this.stringHelper.createAlias(nameCase);
    const isAlias = await this.branchesRepo.existsBy({ alias: alias });

    if (isAlias) {
      throw new ConflictException();
    }

    const metrics = await this.stringHelper.stringMetrics(nameCase);
    const isMetrics = await this.branchesRepo.existsBy({ metrics: metrics });

    if (isMetrics) {
      throw new ConflictException();
    }

    const addressCase = await this.stringHelper.firstLetterCase(address);

    let filename: string;

    if (file) {
      await this.imageUpload.validate(file);
      const date = DateTime.fromJSDate(new Date()).toFormat('MM-dd-yyyy-HH-mm-ss-uu-SSS');

      filename = 'BRANCH' + '-' + date;
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let branchImage: BranchImage | null;

      if (file) {
        const data = await this.cloudFlareService.imageUpload(file, filename);

        if (data) {
          let thumbnail = '';
          let original = '';
          let general = '';

          data.variants.forEach((args) => {
            const url = args.toLowerCase();

            if (url.includes('thumbnail')) {
              thumbnail = args;
            } else if (url.includes('original')) {
              original = args;
            } else if (url.includes('public')) {
              general = args;
            }
          });

          const image = queryRunner.manager.create(BranchImage, {
            imageId: data.id,
            thumbnail: thumbnail,
            original: original,
            public: general,
          });

          branchImage = await queryRunner.manager.save(BranchImage, image);
        }
      }

      const branch = queryRunner.manager.create(Branches, {
        status: EnStatus.ACTIVE,
        name: nameCase,
        address: addressCase,
        alias: alias,
        metrics: metrics,
        branchImage: branchImage,
      });

      const finalQuery = await queryRunner.manager.save(Branches, branch);

      await queryRunner.commitTransaction();

      return plainToInstance(BranchesResponseDto, finalQuery);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }

  async editBranch(branchesRequestDto: BranchesRequestDto, file: Express.Multer.File): Promise<InBranchesResponse> {
    const { bid, name, address } = branchesRequestDto;

    if (!bid || !name || !address) {
      throw new UnprocessableEntityException();
    }

    if (typeof bid !== 'number' || typeof name !== 'string') {
      throw new UnprocessableEntityException();
    }

    const branch = await this.branchesRepo.findOne({ where: { id: bid } });

    if (!branch) {
      throw new UnprocessableEntityException();
    }

    if (branch.status !== EnStatus.ACTIVE) {
      throw new UnprocessableEntityException();
    }

    const oldBranchImage = branch.branchImage;

    const nameCase = await this.stringHelper.firstLetterCase(name);
    const isName = await this.branchesRepo.existsBy({ name: nameCase, id: Not(bid) });

    if (isName) {
      throw new ConflictException();
    }

    const alias = await this.stringHelper.createAlias(nameCase);
    const isAlias = await this.branchesRepo.existsBy({ alias: alias, id: Not(bid) });

    if (isAlias) {
      throw new ConflictException();
    }

    const metrics = await this.stringHelper.stringMetrics(nameCase);
    const isMetrics = await this.branchesRepo.existsBy({ metrics: metrics, id: Not(bid) });

    if (isMetrics) {
      throw new ConflictException();
    }

    const addressCase = await this.stringHelper.firstLetterCase(address);

    let filename: string;

    if (file) {
      await this.imageUpload.validate(file);
      const date = DateTime.fromJSDate(new Date()).toFormat('MM-dd-yyyy-HH-mm-ss-uu-SSS');

      filename = 'BRANCH' + '-' + date;
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let branchImage: BranchImage | null;
      let uploaded = false;

      if (file) {
        const data = await this.cloudFlareService.imageUpload(file, filename);

        if (data) {
          let thumbnail = '';
          let original = '';
          let general = '';

          data.variants.forEach((args) => {
            const url = args.toLowerCase();

            if (url.includes('thumbnail')) {
              thumbnail = args;
            } else if (url.includes('original')) {
              original = args;
            } else if (url.includes('public')) {
              general = args;
            }
          });

          const image = queryRunner.manager.create(BranchImage, {
            imageId: data.id,
            thumbnail: thumbnail,
            original: original,
            public: general,
          });

          branchImage = await queryRunner.manager.save(BranchImage, image);

          uploaded = true;
        }
      }

      branch.branchImage = branchImage;
      branch.name = nameCase;
      branch.address = addressCase;
      branch.alias = alias;
      branch.metrics = metrics;

      const finalQuery = await queryRunner.manager.save(Branches, branch);

      if (uploaded && oldBranchImage) {
        const data = await this.cloudFlareService.imageDelete(oldBranchImage.imageId);

        if (data) {
          await queryRunner.manager.delete(BranchImage, oldBranchImage.id);
        }
      }

      await queryRunner.commitTransaction();

      return plainToInstance(BranchesResponseDto, finalQuery);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }

  async editStatus(branchesRequestDto: BranchesRequestDto): Promise<InBranchesResponse> {
    const { bid, status } = branchesRequestDto;

    if (!bid || !status) {
      throw new UnprocessableEntityException();
    }

    if (typeof bid !== 'number') {
      throw new UnprocessableEntityException();
    }

    const branch = await this.branchesRepo.findOne({ where: { id: bid } });

    if (!branch) {
      throw new UnprocessableEntityException();
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      branch.status = status;

      const finalQuery = await queryRunner.manager.save(Branches, branch);

      await queryRunner.commitTransaction();

      return plainToInstance(BranchesResponseDto, finalQuery);
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }
}
