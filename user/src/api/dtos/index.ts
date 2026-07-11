import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { ORDER_CONSTANTS, PAGINATION_CONSTANTS } from '../common/constant';

export class PaginationDto {
  @ApiPropertyOptional({ default: PAGINATION_CONSTANTS.DEFAULT_PAGE })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = PAGINATION_CONSTANTS.DEFAULT_PAGE;

  @ApiPropertyOptional({ default: PAGINATION_CONSTANTS.DEFAULT_PER_PAGE })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  perPage?: number = PAGINATION_CONSTANTS.DEFAULT_PER_PAGE;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsEnum(ORDER_CONSTANTS)
  sortBy?: string;

  @ApiPropertyOptional({
    enum: ['asc', 'desc'],
    description: 'required if sortBy not null',
  })
  @IsOptional()
  @IsString()
  @IsEnum(['asc', 'desc'])
  @ValidateIf((o: PaginationDto) => !o.sortBy)
  @IsNotEmpty()
  sortOrder?: 'asc' | 'desc';
}

export class DeleteIdsStringDto {
  @ApiProperty({ isArray: true, type: 'string' })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  ids!: string[];
}

export class DeleteIdsNumberDto {
  @ApiProperty({ isArray: true, type: 'number' })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  ids!: number[];
}
