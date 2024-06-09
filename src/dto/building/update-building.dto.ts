import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateBuildingDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  locationIds: string[];
}
