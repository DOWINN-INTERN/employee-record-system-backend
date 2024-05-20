import { Body, Controller, Get, InternalServerErrorException, Patch, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BranchesService } from './branches.service';
import { BranchesRequestDto } from './dto/branches-request.dto';

@Controller('branches')
export class BranchesController {
  constructor(private branchesService: BranchesService) {}

  @Get()
  async getAllBranch() {
    return await this.branchesService.getAllBranch();
  }

  @Post('search')
  async goSearch(@Query('branchName') branchName: string, @Query('branchStatus') branchStatus: string) {
    return await this.branchesService.goSearch(branchName, branchStatus);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async addBranch(@Body() branchesRequestDto: BranchesRequestDto, @UploadedFile() file: Express.Multer.File) {
    return await this.branchesService.addBranch(branchesRequestDto, file);
  }

  @Patch()
  @UseInterceptors(FileInterceptor('file'))
  async modifyBranch(@Body() branchesRequestDto: BranchesRequestDto, @UploadedFile() file: Express.Multer.File) {
    if (branchesRequestDto.bid && branchesRequestDto.status && Object.keys(branchesRequestDto).length === 2) {
      return await this.branchesService.editStatus(branchesRequestDto);
    } else if (!branchesRequestDto.status) {
      return await this.branchesService.editBranch(branchesRequestDto, file);
    } else {
      throw new InternalServerErrorException();
    }
  }
}
