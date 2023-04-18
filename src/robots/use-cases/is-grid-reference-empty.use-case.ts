import { LocationDto } from '../dtos/location.dto';
import { Repository } from 'typeorm';
import { RobotEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class IsGridReferenceEmptyUseCase {
  constructor(
    @InjectRepository(RobotEntity)
    private readonly robotRepository: Repository<RobotEntity>,
  ) {}
  public async run(location: LocationDto): Promise<boolean> {
    const robots = await this.robotRepository.find();

    const robotWithCurrentLocation = robots.filter((robot: RobotEntity) => {
      return (
        robot.locationX === location.locationX &&
        robot.locationY === location.locationY
      );
    });

    return robotWithCurrentLocation.length === 0;
  }
}
