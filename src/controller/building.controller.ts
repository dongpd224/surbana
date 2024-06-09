import { BuildingsService } from './../services/buildings/buildings.service';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UsePipes,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { Building } from 'src/entities/building.entity';
import { CreateBuildingDto, UpdateBuildingDto } from 'src/dto/building';

@Controller('building')
export class BuildingController {
  constructor(private readonly buildingService: BuildingsService) {}

  @Post('create')
  create(@Body() createBuildingDto: CreateBuildingDto): Promise<Building> {
    return this.buildingService.store(createBuildingDto);
  }

  @Get()
  findAll(): Promise<Building[]> {
    return this.buildingService.findAll();
  }

  @Get(':id')
  @UsePipes(new ParseUUIDPipe())
  findOne(@Param('id') id: string): Promise<Building> {
    return this.buildingService.findById(id);
  }

  @Post('update/:id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateBuildingDto: UpdateBuildingDto,
  ): Promise<Building> {
    return this.buildingService.update(id, updateBuildingDto);
  }

  @Post('delete')
  remove(@Body('id', new ParseUUIDPipe()) id: string): Promise<DeleteResult> {
    return this.buildingService.delete(id);
  }
}
