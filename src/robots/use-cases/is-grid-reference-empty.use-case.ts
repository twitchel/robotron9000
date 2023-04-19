import { LocationDto } from '../dtos/location.dto';
import { Repository } from 'typeorm';
import { RobotEntity } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ListRobotsUseCase } from './robot/list-robots.use-case';

@Injectable()
export class IsGridReferenceEmptyUseCase {
  constructor(private readonly listRobotsUseCase: ListRobotsUseCase) {}
  public async run(location: LocationDto): Promise<boolean> {
    const robots = await this.listRobotsUseCase.run();

    const robotWithCurrentLocation = robots.filter((robot: RobotEntity) => {
      return (
        robot.locationX === location.locationX &&
        robot.locationY === location.locationY
      );
    });

    return robotWithCurrentLocation.length === 0;
  }
}
