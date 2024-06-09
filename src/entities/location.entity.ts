import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Building } from './building.entity';
import { Optional } from '@nestjs/common';

@Entity({ schema: 'location_schema' })
export class Location extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  location_code: string;

  @Column({ type: 'float' })
  area: number;

  @ManyToOne(() => Building, (building) => building.locations)
  @JoinColumn({ name: 'building_id' })
  building: Building;

  @ManyToOne(() => Location, (location) => location.childLocations)
  @JoinColumn({ name: 'parent_location_id' })
  parentLocation: Location;

  @OneToMany(() => Location, (location) => location.parentLocation)
  childLocations: Location[];

  @Column()
  building_id: string;

  @Column({ nullable: true })
  @Optional()
  parent_location_id: string;
}
