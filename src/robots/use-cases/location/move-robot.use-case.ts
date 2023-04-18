import { Injectable } from '@nestjs/common';
import { Direction } from '../../../constants';
import { RobotEntity } from '../../entities';
import { CalculateNewLocationUseCase } from '../calculate-new-location.use-case';
import { LocationDto } from '../../dtos/location.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MoveRobotUseCase {
  constructor(
    private readonly calculateNewLocationUseCase: CalculateNewLocationUseCase,
    @InjectRepository(RobotEntity)
    private readonly robotRepository: Repository<RobotEntity>,
  ) {}

  public async run(
    robot: RobotEntity,
    direction: Direction,
  ): Promise<RobotEntity> {
    const currentLocation = new LocationDto(robot.locationX, robot.locationY);

    const newLocation = this.calculateNewLocationUseCase.run(
      currentLocation,
      direction,
    );

    return await this.robotRepository.save({
      ...robot,
      ...newLocation,
    } as RobotEntity);
  }
}
