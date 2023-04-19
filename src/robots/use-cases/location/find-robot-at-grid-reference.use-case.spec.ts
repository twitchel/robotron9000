import { RobotEntity } from '../../entities';
import { Repository } from 'typeorm';
import { LocationDto } from '../../dtos/location.dto';
import { FindRobotAtGridReferenceUseCase } from './find-robot-at-grid-reference.use-case';

describe('FindRobotAtGridReferenceUseCase', () => {
  it('should return a robot from the repository', async () => {
    const locationDto = {
      locationX: 1,
      locationY: 1,
    } as LocationDto;

    const robot = {
      id: 1,
      ...locationDto,
      createdAt: new Date(),
    } as RobotEntity;

    const mockRepository = {
      findOneBy: jest.fn().mockReturnValue(robot),
    } as unknown as Repository<RobotEntity>;

    const useCase = new FindRobotAtGridReferenceUseCase(mockRepository);
    const output = await useCase.run(locationDto);

    expect(output).toStrictEqual(robot);
  });
});
