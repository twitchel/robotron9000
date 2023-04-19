import { ListRobotsUseCase } from './robot/list-robots.use-case';
import { RobotEntity } from '../entities';
import { IsGridReferenceEmptyUseCase } from './is-grid-reference-empty.use-case';
import { LocationDto } from '../dtos/location.dto';

describe('IsGridReferenceEmptyUseCase', () => {
  let listRobotsUseCase: ListRobotsUseCase;
  let useCase: IsGridReferenceEmptyUseCase;

  beforeEach(() => {
    listRobotsUseCase = {
      run: jest.fn().mockReturnValue([
        {
          id: 1,
          locationY: 1,
          locationX: 1,
          createdAt: new Date(),
        } as RobotEntity,
      ]),
    } as unknown as ListRobotsUseCase;

    useCase = new IsGridReferenceEmptyUseCase(listRobotsUseCase);
  });

  it('should return true if grid reference does not contain a robot', async () => {
    const output = await useCase.run({
      locationX: 2,
      locationY: 2,
    } as LocationDto);
    expect(output).toBe(true);
  });

  it('should return false if grid reference does not contain a robot', async () => {
    const output = await useCase.run({
      locationX: 1,
      locationY: 1,
    } as LocationDto);
    expect(output).toBe(false);
  });
});
