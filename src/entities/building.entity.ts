import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Location } from './location.entity';

@Entity()
export class Building {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @OneToMany(() => Location, (location) => location.building)
  location: Location[];
}
