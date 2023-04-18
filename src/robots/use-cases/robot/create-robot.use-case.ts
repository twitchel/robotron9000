import { Injectable } from '@nestjs/common';
import { RobotEntity } from '../../entities';
import { IsGridReferenceEmptyUseCase } from '../is-grid-reference-empty.use-case';
import { LocationDto } from '../../dtos/location.dto';
import { GRID_DEFAULT_X, GRID_DEFAULT_Y } from '../../../constants';
import { GridReferenceContainsBotError } from '../../error/grid-reference-contains-bot.error';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CreateRobotUseCase {
  constructor(
    private readonly isGridReferenceEmptyUseCase: IsGridReferenceEmptyUseCase,
    @InjectRepository(RobotEntity)
    private readonly robotRepository: Repository<RobotEntity>,
  ) {}
  public async run(): Promise<RobotEntity> {
    const location = new LocationDto(GRID_DEFAULT_X, GRID_DEFAULT_Y);

    const isGridReferenceEmpty = await this.isGridReferenceEmptyUseCase.run(
      location,
    );

    if (!isGridReferenceEmpty) {
      throw new GridReferenceContainsBotError();
    }

    return await this.robotRepository.save({
      ...location,
    } as RobotEntity);
  }
}
