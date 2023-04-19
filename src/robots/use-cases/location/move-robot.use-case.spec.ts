import { RobotEntity } from '../../entities';
import { Repository } from 'typeorm';
import { IsGridReferenceEmptyUseCase } from '../is-grid-reference-empty.use-case';
import { LocationDto } from '../../dtos/location.dto';
import {
  Direction,
  DIRECTION_EAST,
  DIRECTION_WEST,
  GRID_DEFAULT_X,
  GRID_DEFAULT_Y,
} from '../../../constants';
import { MoveRobotUseCase } from './move-robot.use-case';
import { CalculateNewLocationUseCase } from '../calculate-new-location.use-case';
import { GridReferenceContainsBotError } from '../../error/grid-reference-contains-bot.error';
import { OutOfBoundsError } from '../../error/out-of-bounds.error';
import { InvalidDirectionError } from '../../error/invalid-direction.error';

describe('MoveRobotsUseCase', () => {
  let repository;
  let calculateNewLocationUseCase: CalculateNewLocationUseCase;
  let isGridReferenceEmptyUseCase: IsGridReferenceEmptyUseCase;
  let robotRepository: Repository<RobotEntity>;
  let useCase: MoveRobotUseCase;

  const locationDto = {
    locationX: GRID_DEFAULT_X,
    locationY: GRID_DEFAULT_Y,
  } as LocationDto;

  beforeEach(() => {
    calculateNewLocationUseCase = {
      run: jest.fn(),
    } as unknown as CalculateNewLocationUseCase;

    isGridReferenceEmptyUseCase = {
      run: jest.fn(),
    } as unknown as IsGridReferenceEmptyUseCase;

    robotRepository = {
      save: jest.fn(),
    } as unknown as Repository<RobotEntity>;

    useCase = new MoveRobotUseCase(
      calculateNewLocationUseCase,
      isGridReferenceEmptyUseCase,
      robotRepository,
    );
  });

  it('should move a robot in a valid direction', async () => {
    // given
    const newLocationDto = {
      locationX: locationDto.locationX + 1,
      locationY: locationDto.locationY,
    } as LocationDto;

    const robotEntity = {
      id: 1,
      ...locationDto,
      createdAt: new Date(),
    } as RobotEntity;

    const updatedRobotEntity = {
      ...robotEntity,
      ...newLocationDto,
    } as RobotEntity;
    calculateNewLocationUseCase.run = jest.fn().mockReturnValue(newLocationDto);
    isGridReferenceEmptyUseCase.run = jest.fn().mockReturnValue(true);
    robotRepository.save = jest.fn().mockReturnValue(updatedRobotEntity);

    // when
    const output = await useCase.run(robotEntity, DIRECTION_WEST);

    // then
    expect(output).toBe(updatedRobotEntity);
    expect(calculateNewLocationUseCase.run).toHaveBeenCalledWith(
      locationDto,
      DIRECTION_WEST,
    );
    expect(isGridReferenceEmptyUseCase.run).toHaveBeenCalledWith(
      newLocationDto,
    );
    expect(robotRepository.save).toHaveBeenCalledWith(updatedRobotEntity);
  });

  it('should throw an error if bot already exists at new location', async () => {
    const newLocationDto = {
      locationX: locationDto.locationX + 1,
      locationY: locationDto.locationY,
    } as LocationDto;

    const robotEntity = {
      id: 1,
      ...locationDto,
      createdAt: new Date(),
    } as RobotEntity;

    calculateNewLocationUseCase.run = jest.fn().mockReturnValue(newLocationDto);
    isGridReferenceEmptyUseCase.run = jest.fn().mockReturnValue(false);

    // when
    await expect(useCase.run(robotEntity, DIRECTION_EAST)).rejects.toThrow(
      GridReferenceContainsBotError,
    );

    // then
    expect(calculateNewLocationUseCase.run).toHaveBeenCalledWith(
      locationDto,
      DIRECTION_EAST,
    );
    expect(isGridReferenceEmptyUseCase.run).toHaveBeenCalledWith(
      newLocationDto,
    );
    expect(robotRepository.save).not.toHaveBeenCalled();
  });

  it('should throw an error if an invalid direction is passed through', async () => {
    const robotEntity = {
      id: 1,
      ...locationDto,
      createdAt: new Date(),
    } as RobotEntity;

    calculateNewLocationUseCase.run = jest
      .fn()
      .mockRejectedValue(new OutOfBoundsError());

    // when
    await expect(useCase.run(robotEntity, 'H' as Direction)).rejects.toThrow(
      InvalidDirectionError,
    );

    // then
    expect(calculateNewLocationUseCase.run).not.toHaveBeenCalled();
    expect(isGridReferenceEmptyUseCase.run).not.toHaveBeenCalled();
    expect(robotRepository.save).not.toHaveBeenCalled();
  });
});
