import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Location } from './location.entity';

@Entity({ schema: 'location_schema' })
export class Building extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @OneToMany(() => Location, (location) => location.building)
  locations: Location[];
}
