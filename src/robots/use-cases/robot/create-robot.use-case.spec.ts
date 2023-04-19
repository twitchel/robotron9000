import { RobotEntity } from '../../entities';
import { Repository } from 'typeorm';
import { FindRobotUseCase } from './find-robot.use-case';
import { CreateRobotUseCase } from './create-robot.use-case';
import { IsGridReferenceEmptyUseCase } from '../is-grid-reference-empty.use-case';
import { LocationDto } from '../../dtos/location.dto';
import { GridReferenceContainsBotError } from '../../error/grid-reference-contains-bot.error';
import { GRID_DEFAULT_X, GRID_DEFAULT_Y } from '../../../constants';

describe('CreateRobotsUseCase', () => {
  let repository;
  let isGridReferenceEmptyUseCase: IsGridReferenceEmptyUseCase;
  let robotRepository: Repository<RobotEntity>;
  let useCase: CreateRobotUseCase;

  const locationDto = {
    locationX: GRID_DEFAULT_X,
    locationY: GRID_DEFAULT_Y,
  } as LocationDto;

  beforeEach(() => {
    isGridReferenceEmptyUseCase = {
      run: jest.fn(),
    } as unknown as IsGridReferenceEmptyUseCase;

    robotRepository = {
      save: jest.fn(),
    } as unknown as Repository<RobotEntity>;

    useCase = new CreateRobotUseCase(
      isGridReferenceEmptyUseCase,
      robotRepository,
    );
  });

  it('should create a robot', async () => {
    const mockRobotEntity = {
      id: 1,
      ...locationDto,
      createdAt: new Date(),
    } as RobotEntity;
    isGridReferenceEmptyUseCase.run = jest.fn().mockReturnValue(true);
    robotRepository.save = jest.fn().mockReturnValue(mockRobotEntity);

    expect(await useCase.run()).toBe(mockRobotEntity);

    expect(isGridReferenceEmptyUseCase.run).toHaveBeenCalledWith(locationDto);
    expect(robotRepository.save).toHaveBeenCalledWith({
      ...locationDto,
    } as RobotEntity);
  });

  it('should throw an error if bot exists at start location', async () => {
    isGridReferenceEmptyUseCase.run = jest.fn().mockReturnValue(false);

    await expect(useCase.run()).rejects.toThrow(GridReferenceContainsBotError);

    expect(isGridReferenceEmptyUseCase.run).toHaveBeenCalledWith(locationDto);
    expect(robotRepository.save).not.toHaveBeenCalled();
  });
});
