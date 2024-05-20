import { Body, Controller, Get, InternalServerErrorException, Patch, Post } from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { DepartmentsRequestDto } from './dto/departments-request.dto';

@Controller('departments')
export class DepartmentsController {
  constructor(private departmentsService: DepartmentsService) {}

  @Get()
  async getAllDepartment() {
    return await this.departmentsService.getAllDepartment();
  }

  @Post()
  async addDepartment(@Body() departmentsRequestDto: DepartmentsRequestDto) {
    return await this.departmentsService.addDepartment(departmentsRequestDto);
  }

  @Patch()
  async modifyDepartment(@Body() departmentsRequestDto: DepartmentsRequestDto) {
    if (departmentsRequestDto.did && departmentsRequestDto.status && Object.keys(departmentsRequestDto).length === 2) {
      return await this.departmentsService.editStatus(departmentsRequestDto);
    } else if (!departmentsRequestDto.status) {
      return await this.departmentsService.editDepartment(departmentsRequestDto);
    } else {
      throw new InternalServerErrorException();
    }
  }
}
