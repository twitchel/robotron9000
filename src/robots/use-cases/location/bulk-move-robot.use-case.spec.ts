import { BulkMoveRobotUseCase } from './bulk-move-robot.use-case';
import { ProcessMovementsUseCase } from './process-movements.use-case';
import { CalculateNewLocationUseCase } from '../calculate-new-location.use-case';
import { FindRobotAtGridReferenceUseCase } from './find-robot-at-grid-reference.use-case';
import { Repository } from 'typeorm';
import { RobotEntity } from '../../entities';
import { LocationDto } from '../../dtos/location.dto';
import { Direction, DIRECTION_SOUTH, DIRECTION_WEST } from '../../../constants';
import { InvalidDirectionError } from '../../error/invalid-direction.error';
import { GridReferenceContainsBotError } from '../../error/grid-reference-contains-bot.error';
import { OutOfBoundsError } from '../../error/out-of-bounds.error';

describe('BulkMoveRobotUseCase', () => {
  let processMovementsUseCase: ProcessMovementsUseCase;
  let calculateNewLocationUseCase: CalculateNewLocationUseCase;
  let findRobotAtGridReferenceUseCase: FindRobotAtGridReferenceUseCase;
  let robotRepository: Repository<RobotEntity>;
  let useCase: BulkMoveRobotUseCase;

  const startingLocationDto: LocationDto = {
    locationX: 1,
    locationY: 1,
  } as LocationDto;
  const expectedLocationDto: LocationDto = {
    locationX: 1,
    locationY: 4,
  } as LocationDto;

  const myRobot = {
    id: 1,
    ...startingLocationDto,
    createdAt: new Date(),
  } as RobotEntity;
  const expectedRobot = {
    ...myRobot,
    ...expectedLocationDto,
  } as RobotEntity;

  const movementPath = 'S S S';
  const processedMovements = [
    DIRECTION_SOUTH as Direction,
    DIRECTION_SOUTH as Direction,
    DIRECTION_SOUTH as Direction,
  ];

  beforeEach(() => {
    processMovementsUseCase = {
      run: jest.fn(),
    } as unknown as ProcessMovementsUseCase;

    calculateNewLocationUseCase = {
      run: jest.fn(),
    } as unknown as CalculateNewLocationUseCase;

    findRobotAtGridReferenceUseCase = {
      run: jest.fn(),
    } as unknown as FindRobotAtGridReferenceUseCase;

    robotRepository = {
      save: jest.fn(),
    } as unknown as Repository<RobotEntity>;
    useCase = new BulkMoveRobotUseCase(
      processMovementsUseCase,
      calculateNewLocationUseCase,
      findRobotAtGridReferenceUseCase,
      robotRepository,
    );
  });

  it('should successfully apply a series of movements to a robot', async () => {
    // given
    processMovementsUseCase.run = jest.fn().mockReturnValue(processedMovements);
    calculateNewLocationUseCase.run = jest
      .fn()
      .mockReturnValueOnce({ locationX: 1, locationY: 2 } as LocationDto)
      .mockReturnValueOnce({ locationX: 1, locationY: 3 } as LocationDto)
      .mockReturnValueOnce({ locationX: 1, locationY: 4 } as LocationDto);
    findRobotAtGridReferenceUseCase.run = jest.fn().mockReturnValue(null);
    robotRepository.save = jest.fn().mockReturnValue(expectedRobot);

    // when
    const updatedRobot = await useCase.run(myRobot, movementPath);

    // then
    expect(updatedRobot).toStrictEqual(expectedRobot);
    expect(processMovementsUseCase.run).toHaveBeenCalledWith(movementPath);
    expect(calculateNewLocationUseCase.run).toHaveBeenCalledTimes(3);
    expect(findRobotAtGridReferenceUseCase.run).toHaveBeenCalledWith(
      expectedLocationDto,
    );
    expect(robotRepository.save).toHaveBeenCalledWith(expectedRobot);
  });

  it('should not apply a series of movements to a robot if a direction provided is empty', async () => {
    // given
    const brokenMovementPath = '';
    processMovementsUseCase.run = jest.fn().mockImplementation(() => {
      throw new InvalidDirectionError();
    });

    // when
    await expect(useCase.run(myRobot, brokenMovementPath)).rejects.toThrow(
      InvalidDirectionError,
    );

    // then
    expect(processMovementsUseCase.run).toHaveBeenCalled();
    expect(calculateNewLocationUseCase.run).not.toHaveBeenCalled();
    expect(findRobotAtGridReferenceUseCase.run).not.toHaveBeenCalled();
    expect(robotRepository.save).not.toHaveBeenCalled();
  });

  it('should not apply a series of movements to a robot if a direction provided is invalid', async () => {
    // given
    const brokenMovementPath = 'A B C';
    processMovementsUseCase.run = jest.fn().mockImplementation(() => {
      throw new InvalidDirectionError();
    });

    // when
    await expect(useCase.run(myRobot, brokenMovementPath)).rejects.toThrow(
      InvalidDirectionError,
    );

    // then
    expect(processMovementsUseCase.run).toHaveBeenCalled();
    expect(calculateNewLocationUseCase.run).not.toHaveBeenCalled();
    expect(findRobotAtGridReferenceUseCase.run).not.toHaveBeenCalled();
    expect(robotRepository.save).not.toHaveBeenCalled();
  });

  it('should not apply a series of movements to a robot if the robot will move out of bounds', async () => {
    // given
    const outOfBoundsDirections = 'S W';

    processMovementsUseCase.run = jest
      .fn()
      .mockReturnValue([
        DIRECTION_SOUTH as Direction,
        DIRECTION_WEST as Direction,
      ]);
    calculateNewLocationUseCase.run = jest
      .fn()
      .mockReturnValueOnce({ locationX: 1, locationY: 2 } as LocationDto)
      .mockImplementationOnce(() => {
        throw new OutOfBoundsError();
      });
    findRobotAtGridReferenceUseCase.run = jest.fn().mockReturnValue(null);

    // when
    await expect(useCase.run(myRobot, outOfBoundsDirections)).rejects.toThrow(
      OutOfBoundsError,
    );

    // then
    expect(processMovementsUseCase.run).toHaveBeenCalledWith(
      outOfBoundsDirections,
    );
    expect(calculateNewLocationUseCase.run).toHaveBeenCalledTimes(2);
    expect(findRobotAtGridReferenceUseCase.run).toHaveBeenNthCalledWith(1, {
      locationX: 1,
      locationY: 2,
    } as LocationDto);
    expect(findRobotAtGridReferenceUseCase.run).toHaveBeenCalledTimes(1);
    expect(robotRepository.save).not.toHaveBeenCalledWith(expectedRobot);
  });

  it('should not apply a series of movements to a robot if a collision would occur', async () => {
    // given
    const otherRobot = {
      id: 2,
      locationX: 1,
      locationY: 3,
      createdAt: new Date(),
    } as RobotEntity;

    processMovementsUseCase.run = jest.fn().mockReturnValue(processedMovements);
    calculateNewLocationUseCase.run = jest
      .fn()
      .mockReturnValueOnce({ locationX: 1, locationY: 2 } as LocationDto)
      .mockReturnValueOnce({ locationX: 1, locationY: 3 } as LocationDto)
      .mockReturnValueOnce({ locationX: 1, locationY: 4 } as LocationDto);
    findRobotAtGridReferenceUseCase.run = jest
      .fn()
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(otherRobot);

    // when
    await expect(useCase.run(myRobot, movementPath)).rejects.toThrow(
      GridReferenceContainsBotError,
    );

    // then
    expect(processMovementsUseCase.run).toHaveBeenCalledWith(movementPath);
    expect(calculateNewLocationUseCase.run).toHaveBeenCalledTimes(2);
    expect(findRobotAtGridReferenceUseCase.run).toHaveBeenNthCalledWith(1, {
      locationX: 1,
      locationY: 2,
    } as LocationDto);
    expect(findRobotAtGridReferenceUseCase.run).toHaveBeenNthCalledWith(2, {
      locationX: 1,
      locationY: 3,
    } as LocationDto);
    expect(findRobotAtGridReferenceUseCase.run).not.toHaveBeenCalledWith(1, {
      locationX: 1,
      locationY: 4,
    } as LocationDto);
    expect(robotRepository.save).not.toHaveBeenCalledWith(expectedRobot);
  });
});
