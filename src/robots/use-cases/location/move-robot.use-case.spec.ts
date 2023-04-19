import { RobotEntity } from '../../entities';
import { Repository } from 'typeorm';
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
import { FindRobotAtGridReferenceUseCase } from './find-robot-at-grid-reference.use-case';

describe('MoveRobotsUseCase', () => {
  let calculateNewLocationUseCase: CalculateNewLocationUseCase;
  let findRobotAtGridReferenceUseCase: FindRobotAtGridReferenceUseCase;
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

    findRobotAtGridReferenceUseCase = {
      run: jest.fn(),
    } as unknown as FindRobotAtGridReferenceUseCase;

    robotRepository = {
      save: jest.fn(),
    } as unknown as Repository<RobotEntity>;

    useCase = new MoveRobotUseCase(
      calculateNewLocationUseCase,
      findRobotAtGridReferenceUseCase,
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
    findRobotAtGridReferenceUseCase.run = jest.fn().mockReturnValue(null);
    robotRepository.save = jest.fn().mockReturnValue(updatedRobotEntity);

    // when
    const output = await useCase.run(robotEntity, DIRECTION_WEST);

    // then
    expect(output).toBe(updatedRobotEntity);
    expect(calculateNewLocationUseCase.run).toHaveBeenCalledWith(
      locationDto,
      DIRECTION_WEST,
    );
    expect(findRobotAtGridReferenceUseCase.run).toHaveBeenCalledWith(
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
    findRobotAtGridReferenceUseCase.run = jest
      .fn()
      .mockReturnValue({ ...robotEntity, id: 2 } as RobotEntity);

    // when
    await expect(useCase.run(robotEntity, DIRECTION_EAST)).rejects.toThrow(
      GridReferenceContainsBotError,
    );

    // then
    expect(calculateNewLocationUseCase.run).toHaveBeenCalledWith(
      locationDto,
      DIRECTION_EAST,
    );
    expect(findRobotAtGridReferenceUseCase.run).toHaveBeenCalledWith(
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
    expect(findRobotAtGridReferenceUseCase.run).not.toHaveBeenCalled();
    expect(robotRepository.save).not.toHaveBeenCalled();
  });
});
