import { Injectable } from '@nestjs/common';
import { RobotEntity } from '../../entities';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FindRobotUseCase {
  constructor(
    @InjectRepository(RobotEntity)
    private readonly robotRepository: Repository<RobotEntity>,
  ) {}
  public async run(id: number): Promise<RobotEntity> {
    return this.robotRepository.findOneBy({ id });
  }
}
