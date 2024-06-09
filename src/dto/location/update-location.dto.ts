import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateLocationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  location_code?: string;

  @IsOptional()
  @IsNumber()
  area?: number;

  @IsOptional()
  @IsString()
  building_id?: string;

  @IsOptional()
  @IsString()
  parent_location_id?: string;

  @IsOptional()
  @IsString()
  childrenLocationIds?: string[];
}
