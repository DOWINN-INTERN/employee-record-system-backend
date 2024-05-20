import { PartialType } from '@nestjs/mapped-types';
import { positionsDto } from './positions.dto';

export class PositionRequestDto extends PartialType(positionsDto) {}
