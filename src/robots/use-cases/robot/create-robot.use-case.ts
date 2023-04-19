import { Injectable } from '@nestjs/common';
import { RobotEntity } from '../../entities';
import { LocationDto } from '../../dtos/location.dto';
import { GRID_DEFAULT_X, GRID_DEFAULT_Y } from '../../../constants';
import { GridReferenceContainsBotError } from '../../error/grid-reference-contains-bot.error';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FindRobotAtGridReferenceUseCase } from '../location/find-robot-at-grid-reference.use-case';

@Injectable()
export class CreateRobotUseCase {
  constructor(
    private readonly findRobotAtGridReferenceUseCase: FindRobotAtGridReferenceUseCase,
    @InjectRepository(RobotEntity)
    private readonly robotRepository: Repository<RobotEntity>,
  ) {}
  public async run(): Promise<RobotEntity> {
    const location = new LocationDto(GRID_DEFAULT_X, GRID_DEFAULT_Y);

    const robotAtLocation = await this.findRobotAtGridReferenceUseCase.run(
      location,
    );

    if (robotAtLocation) {
      throw new GridReferenceContainsBotError();
    }

    return await this.robotRepository.save({
      ...location,
    } as RobotEntity);
  }
}
