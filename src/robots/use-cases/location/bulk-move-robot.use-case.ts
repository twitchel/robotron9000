import { Injectable } from '@nestjs/common';
import { ProcessMovementsUseCase } from './process-movements.use-case';
import { RobotEntity } from '../../entities';
import { CalculateNewLocationUseCase } from '../calculate-new-location.use-case';
import { LocationDto } from '../../dtos/location.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FindRobotAtGridReferenceUseCase } from './find-robot-at-grid-reference.use-case';
import { GridReferenceContainsBotError } from '../../error/grid-reference-contains-bot.error';
import { InvalidDirectionError } from '../../error/invalid-direction.error';

@Injectable()
export class BulkMoveRobotUseCase {
  constructor(
    private readonly processMovementsUseCase: ProcessMovementsUseCase,
    private readonly calculateNewLocationUseCase: CalculateNewLocationUseCase,
    private readonly findRobotAtGridReferenceUseCase: FindRobotAtGridReferenceUseCase,
    @InjectRepository(RobotEntity)
    private readonly robotRepository: Repository<RobotEntity>,
  ) {}
  public async run(
    robot: RobotEntity,
    movementsInput: string,
  ): Promise<RobotEntity> {
    const movements = this.processMovementsUseCase.run(movementsInput);

    let location: LocationDto = {
      locationX: robot.locationX,
      locationY: robot.locationY,
    } as LocationDto;

    for (const direction of movements) {
      location = this.calculateNewLocationUseCase.run(location, direction);

      if ((await this.findRobotAtGridReferenceUseCase.run(location)) !== null) {
        throw new GridReferenceContainsBotError();
      }
    }

    robot.locationX = location.locationX;
    robot.locationY = location.locationY;

    await this.robotRepository.save(robot);

    return robot;
  }
}
