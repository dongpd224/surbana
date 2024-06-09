import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, In, Repository } from 'typeorm';
import { Location } from '../../entities/location.entity';
import { UpdateLocationDto, CreateLocationDto } from '../../dto/location';
import { Building } from '../../entities/building.entity';
import { IBaseService } from '../base.service';
import { HIERACHY_QUERY } from './locations.query';

@Injectable()
export class LocationsService implements IBaseService<Location> {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    @InjectRepository(Building)
    private buildingRepository: Repository<Building>,
    private dataSource: DataSource,
  ) {}
  async findById(id: string): Promise<Location> {
    const location = await this.locationRepository.findOne({
      where: { id: id },
      relations: ['building', 'parentLocation'],
    });
    if (!location) {
      throw new NotFoundException('Location not found');
    }
    let locationNumber;
    if (location.parentLocation) {
      locationNumber = `${location.building.name}-${await this.getParentCode(location.parentLocation)}-${location.location_code}`;
    } else {
      locationNumber = `${location.building.name}-${location.location_code}`;
    }
    return {
      id: location.id,
      name: location.name,
      location_code: location.location_code,
      area: location.area,
      building_id: location.building_id,
      parent_location_id: location.parent_location_id,
      locationNumber: locationNumber,
    } as any;
  }
  async getLocationHierarchy(rootLocationId: string): Promise<Location[]> {
    const locations = await this.locationRepository.query(HIERACHY_QUERY, [
      rootLocationId,
    ]);
    return locations;
  }

  async store(createLocationDto: CreateLocationDto): Promise<Location> {
    const { name, area, building_id, parent_location_id, location_code } =
      createLocationDto;
    let building;
    let parentLocation;
    let locationNumber;

    await this.checkUniqueCode(
      createLocationDto?.location_code,
      createLocationDto?.name,
    );

    if (building_id) {
      building = await this.buildingRepository.findOne({
        where: { id: building_id },
      });
      if (!building) {
        throw new BadRequestException('The id of building is not correct');
      }
    }
    if (parent_location_id) {
      parentLocation = await this.locationRepository.findOne({
        where: { id: parent_location_id },
      });
      if (!parentLocation) {
        throw new BadRequestException(
          'The id of parent location is not correct',
        );
      }
      if (parentLocation && parentLocation.building_id !== building_id) {
        throw new BadRequestException(
          'The buildingId of the new location must match the buildingId of its parent location.',
        );
      }
    }
    const location = this.locationRepository.create({
      name: name,
      location_code: location_code,
      area: area,
      parentLocation: parentLocation,
      building_id: building_id,
    });
    const result = await this.locationRepository.save(location);
    if (result) {
      locationNumber = `${building.name}-${await this.getParentCode(parentLocation)}-${location.location_code}`;
    }
    return {
      ...result,
      locationNumber,
    } as any;
  }
  async delete(id: string): Promise<DeleteResult> {
    return this.locationRepository.delete(id);
  }

  async findAll(): Promise<Location[]> {
    return this.locationRepository.find({
      relations: ['building', 'parentLocation', 'childLocations'],
    });
  }
  async update(
    id: string,
    updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const location = await this.locationRepository.findOne({
        where: { id: id },
        relations: ['building'],
      });
      if (
        location.name !== updateLocationDto?.name ||
        location.location_code !== updateLocationDto?.location_code
      ) {
        await this.checkUniqueCode(
          updateLocationDto?.location_code,
          updateLocationDto?.name,
        );
      }
      const {
        name,
        location_code,
        area,
        building_id,
        parent_location_id,
        childrenLocationIds,
      } = updateLocationDto;

      if (building_id) {
        const building = await this.buildingRepository.findOneBy({
          id: building_id,
        });
        if (!building) {
          throw new NotFoundException('Building not found');
        }
        location.building = building;
      }

      let locationNumber;
      if (parent_location_id) {
        const parentLocation = await this.locationRepository.findOneBy({
          id: parent_location_id,
        });
        if (!parentLocation) {
          throw new NotFoundException('Parent location not found');
        }
        location.parentLocation = parentLocation;
        locationNumber = `${location.building.name}-${await this.getParentCode(location.parentLocation)}-${location.location_code}`;
      }
      if (childrenLocationIds) {
        const childrenLocations = await this.locationRepository.findBy({
          id: In(childrenLocationIds),
        });
        location.childLocations = childrenLocations;
      }

      if (name !== undefined) location.name = name;
      if (location_code !== undefined) location.location_code = location_code;
      if (area !== undefined) location.area = area;

      await this.locationRepository.save(location);

      await queryRunner.commitTransaction();
      return {
        ...location,
        locationNumber,
      } as any;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new ForbiddenException('Error while updating location');
    } finally {
      await queryRunner.release();
    }
  }
  private async getParentCode(location: Location): Promise<string> {
    if (!location.parent_location_id) {
      return location.location_code;
    }

    const parent = await this.locationRepository.findOneBy({
      id: location.parent_location_id,
    });

    if (!parent) {
      throw new NotFoundException('Parent location not found');
    }

    const parentCode = await this.getParentCode(parent);
    return `${parentCode}-${location.location_code}`;
  }
  private async checkUniqueCode(code: string, name?: string) {
    const existingLocation = await this.locationRepository.findOne({
      where: [{ location_code: code, name }],
    });

    if (existingLocation) {
      throw new ConflictException(
        'Location with the same name or location code already exists',
      );
    }
  }
}
