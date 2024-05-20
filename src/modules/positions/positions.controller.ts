import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PositionRequestDto } from './dto/position-request.dto';
import { PositionsService } from './positions.service';

@Controller()
export class PositionsController {
  constructor(private positionsService: PositionsService) {}

  @Get('positions')
  async getAllPositions() {
    return await this.positionsService.getAllPositions();
  }

  @Get('branch/:balias/department/:dalias/positions')
  async getDeptPositions(@Param('balias') balias: string, @Param('dalias') dalias: string) {
    return await this.positionsService.getDepartmentPositions(balias, dalias);
  }

  @Post('branch/:balias/department/:dalias/positions')
  async addPosition(@Param('balias') balias: string, @Param('dalias') dalias: string, @Body() positionRequestDto: PositionRequestDto) {
    return await this.positionsService.addPosition(balias, dalias, positionRequestDto);
  }

  @Patch('branch/:balias/department/:dalias/positions')
  async editPosition(@Param('balias') balias: string, @Param('dalias') dalias: string, @Body() positionRequestDto: PositionRequestDto) {
    return await this.positionsService.editPosition(balias, dalias, positionRequestDto);
  }
}
