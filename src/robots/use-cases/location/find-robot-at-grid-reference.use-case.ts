import { Injectable } from '@nestjs/common';
import { RobotEntity } from '../../entities';
import { Repository } from 'typeorm';
import { LocationDto } from '../../dtos/location.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FindRobotAtGridReferenceUseCase {
  constructor(
    @InjectRepository(RobotEntity)
    private readonly robotRepository: Repository<RobotEntity>,
  ) {}

  public async run(location: LocationDto): Promise<RobotEntity | null> {
    return this.robotRepository.findOneBy(location);
  }
}
