import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { RequirementsRequestDto } from './dto/requirements-request.dto';
import { RequirementsService } from './requirements.service';

@Controller('requirements')
export class RequirementsController {
  constructor(private requirementsService: RequirementsService) {}

  @Get()
  async getRequirements() {
    return await this.requirementsService.getRequirements();
  }

  @Post()
  async addRequirement(@Body() requirementsRequestDto: RequirementsRequestDto) {
    return await this.requirementsService.addRequirement(requirementsRequestDto);
  }

  @Patch()
  async editRequirement(@Body() requirementsRequestDto: RequirementsRequestDto) {
    return await this.requirementsService.editRequirement(requirementsRequestDto);
  }
}
