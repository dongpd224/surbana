import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  name: string;

  @IsNumber()
  area: number;

  @IsString()
  building_id: string;

  @IsString()
  location_code: string;

  @IsOptional()
  @IsString()
  parent_location_id?: string;
}
