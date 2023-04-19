import { Injectable } from '@nestjs/common';
import { Direction, ValidDirections } from '../../../constants';
import { RobotEntity } from '../../entities';
import { CalculateNewLocationUseCase } from '../calculate-new-location.use-case';
import { LocationDto } from '../../dtos/location.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GridReferenceContainsBotError } from '../../error/grid-reference-contains-bot.error';
import { InvalidDirectionError } from '../../error/invalid-direction.error';
import { FindRobotAtGridReferenceUseCase } from './find-robot-at-grid-reference.use-case';

@Injectable()
export class MoveRobotUseCase {
  constructor(
    private readonly calculateNewLocationUseCase: CalculateNewLocationUseCase,
    private readonly findRobotAtGridReferenceUseCase: FindRobotAtGridReferenceUseCase,
    @InjectRepository(RobotEntity)
    private readonly robotRepository: Repository<RobotEntity>,
  ) {}

  public async run(
    robot: RobotEntity,
    direction: Direction,
  ): Promise<RobotEntity> {
    if (!ValidDirections.includes(direction)) {
      throw new InvalidDirectionError(direction);
    }

    const currentLocation = new LocationDto(robot.locationX, robot.locationY);

    const newLocation = this.calculateNewLocationUseCase.run(
      currentLocation,
      direction,
    );

    if (await this.findRobotAtGridReferenceUseCase.run(newLocation)) {
      throw new GridReferenceContainsBotError();
    }

    return await this.robotRepository.save({
      ...robot,
      ...newLocation,
    } as RobotEntity);
  }
}
