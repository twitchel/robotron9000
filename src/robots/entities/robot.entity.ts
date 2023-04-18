import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('robot')
export class RobotEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { nullable: true })
  locationX: number;

  @Column('int', { nullable: true })
  locationY: number;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
