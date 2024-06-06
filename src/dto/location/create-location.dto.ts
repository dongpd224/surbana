import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  name: string;

  @IsString()
  number: string;

  @IsNumber()
  area: number;

  @IsNumber()
  buildingId: number;

  @IsOptional()
  @IsNumber()
  parentLocationId?: number;
}
