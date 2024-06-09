import { IBaseService } from './../base.service';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBuildingDto, UpdateBuildingDto } from 'src/dto/building';
import { Building } from 'src/entities/building.entity';
import { DataSource, DeleteResult, In, Repository } from 'typeorm';
import { Location } from 'src/entities/location.entity';
import { EntityId } from 'typeorm/repository/EntityId';

@Injectable()
export class BuildingsService implements IBaseService<Building> {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    @InjectRepository(Building)
    private buildingRepository: Repository<Building>,
    private dataSource: DataSource,
  ) {}
  index(): Promise<Building[]> {
    throw new Error('Method not implemented.');
  }
  async findById(id: string): Promise<Building> {
    return this.buildingRepository.findOneBy({
      id: id,
    });
  }
  async findByIds(ids: [string]): Promise<Building[]> {
    return this.buildingRepository.findBy({
      id: In(ids),
    });
  }
  async store(createBuildingDto: CreateBuildingDto): Promise<Building> {
    await this.checkUniqueName(createBuildingDto.name);
    const building = this.buildingRepository.create(createBuildingDto);
    return this.buildingRepository.save(building);
  }
  async update(
    id: string,
    updateBuildingDto: UpdateBuildingDto,
  ): Promise<Building> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (updateBuildingDto?.name) {
        await this.checkUniqueName(updateBuildingDto.name);
      }
      const building = await queryRunner.manager.findOne(Building, {
        where: { id: id },
      });

      const { name, locationIds } = updateBuildingDto;

      if (name !== undefined) {
        building.name = name;
      }

      if (locationIds) {
        const locations = await queryRunner.manager.findBy(Location, {
          id: In(locationIds),
        });
        if (locations.length !== locationIds.length) {
          throw new NotFoundException('One or more locations not found');
        }
        building.locations = locations;
      }

      await queryRunner.manager.save(building);
      await queryRunner.commitTransaction();

      return building;
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
  delete(id: EntityId): Promise<DeleteResult> {
    try {
      return this.buildingRepository.delete(id);
    } catch (err) {
      throw new ForbiddenException(err);
    }
  }

  async findAll(): Promise<Building[]> {
    return this.buildingRepository.find();
  }

  async findOne(id: string): Promise<Building> {
    return this.buildingRepository.findOneBy({
      id: id,
    });
  }
  private async checkUniqueName(name: string) {
    const existingBuilding = await this.buildingRepository.findOne({
      where: { name: name },
    });

    if (existingBuilding) {
      throw new ConflictException('Building with the same name already exists');
    }
  }
}
