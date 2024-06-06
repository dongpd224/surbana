import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Building } from './building.entity';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: string;
  @Column()
  name: string;
  @Column('decimal')
  area: number;
  @Column()
  number: string;

  @ManyToOne(() => Building, (building) => building.location)
  building: Building;

  @ManyToOne(() => Location, (location) => location.children)
  parentLocation: Location;

  @OneToMany(() => Location, (location) => location.parentLocation)
  children: Location[];
}
