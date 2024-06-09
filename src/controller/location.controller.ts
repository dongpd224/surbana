import { LocationsService } from '../services/locations/locations.service';
import { UpdateLocationDto, CreateLocationDto } from '../dto/location/index';
import { Location } from '../entities/location.entity';
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

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post('create')
  create(@Body() createLocationDto: CreateLocationDto): Promise<Location> {
    return this.locationsService.store(createLocationDto);
  }

  @Get()
  findAll(): Promise<Location[]> {
    return this.locationsService.findAll();
  }

  @Get(':id')
  @UsePipes(new ParseUUIDPipe())
  findOne(@Param('id') id: string): Promise<Location> {
    return this.locationsService.findById(id);
  }

  @Get('hierachy/:id')
  getHierachy(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Location[]> {
    return this.locationsService.getLocationHierarchy(id);
  }

  @Post('update/:id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    return this.locationsService.update(id, updateLocationDto);
  }

  @Post('delete')
  remove(@Body('id', new ParseUUIDPipe()) id: string): Promise<DeleteResult> {
    return this.locationsService.delete(id);
  }
}
