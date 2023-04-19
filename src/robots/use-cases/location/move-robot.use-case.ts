import { Injectable } from '@nestjs/common';
import { Direction, ValidDirections } from '../../../constants';
import { RobotEntity } from '../../entities';
import { CalculateNewLocationUseCase } from '../calculate-new-location.use-case';
import { LocationDto } from '../../dtos/location.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IsGridReferenceEmptyUseCase } from '../is-grid-reference-empty.use-case';
import { GridReferenceContainsBotError } from '../../error/grid-reference-contains-bot.error';
import { InvalidDirectionError } from '../../error/invalid-direction.error';

@Injectable()
export class MoveRobotUseCase {
  constructor(
    private readonly calculateNewLocationUseCase: CalculateNewLocationUseCase,
    private readonly isGridReferenceEmptyUseCase: IsGridReferenceEmptyUseCase,
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

    if (await this.isGridReferenceEmptyUseCase.run(newLocation)) {
      return await this.robotRepository.save({
        ...robot,
        ...newLocation,
      } as RobotEntity);
    }

    throw new GridReferenceContainsBotError();
  }
}
