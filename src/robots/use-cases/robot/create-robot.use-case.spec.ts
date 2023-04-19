import { RobotEntity } from '../../entities';
import { Repository } from 'typeorm';
import { CreateRobotUseCase } from './create-robot.use-case';
import { LocationDto } from '../../dtos/location.dto';
import { GridReferenceContainsBotError } from '../../error/grid-reference-contains-bot.error';
import { GRID_DEFAULT_X, GRID_DEFAULT_Y } from '../../../constants';
import { FindRobotAtGridReferenceUseCase } from '../location/find-robot-at-grid-reference.use-case';

describe('CreateRobotsUseCase', () => {
  let findRobotAtGridReferenceUseCase: FindRobotAtGridReferenceUseCase;
  let robotRepository: Repository<RobotEntity>;
  let useCase: CreateRobotUseCase;

  const locationDto = {
    locationX: GRID_DEFAULT_X,
    locationY: GRID_DEFAULT_Y,
  } as LocationDto;

  beforeEach(() => {
    findRobotAtGridReferenceUseCase = {
      run: jest.fn(),
    } as unknown as FindRobotAtGridReferenceUseCase;

    robotRepository = {
      save: jest.fn(),
    } as unknown as Repository<RobotEntity>;

    useCase = new CreateRobotUseCase(
      findRobotAtGridReferenceUseCase,
      robotRepository,
    );
  });

  it('should create a robot', async () => {
    const mockRobotEntity = {
      id: 1,
      ...locationDto,
      createdAt: new Date(),
    } as RobotEntity;
    findRobotAtGridReferenceUseCase.run = jest.fn().mockReturnValue(null);
    robotRepository.save = jest.fn().mockReturnValue(mockRobotEntity);

    expect(await useCase.run()).toBe(mockRobotEntity);

    expect(findRobotAtGridReferenceUseCase.run).toHaveBeenCalledWith(
      locationDto,
    );
    expect(robotRepository.save).toHaveBeenCalledWith({
      ...locationDto,
    } as RobotEntity);
  });

  it('should throw an error if bot exists at start location', async () => {
    const mockExistingRobotEntity = {
      id: 1,
      ...locationDto,
      createdAt: new Date(),
    } as RobotEntity;
    findRobotAtGridReferenceUseCase.run = jest
      .fn()
      .mockReturnValue(mockExistingRobotEntity);

    await expect(useCase.run()).rejects.toThrow(GridReferenceContainsBotError);

    expect(findRobotAtGridReferenceUseCase.run).toHaveBeenCalledWith(
      locationDto,
    );
    expect(robotRepository.save).not.toHaveBeenCalled();
  });
});
