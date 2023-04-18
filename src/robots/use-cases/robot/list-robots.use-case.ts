import { RobotEntity } from '../../entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ListRobotsUseCase {
  constructor(
    @InjectRepository(RobotEntity)
    private readonly robotRepository: Repository<RobotEntity>,
  ) {}

  public async run(): Promise<RobotEntity[]> {
    return this.robotRepository.find();
  }
}
