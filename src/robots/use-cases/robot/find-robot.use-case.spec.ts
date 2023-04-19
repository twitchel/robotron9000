import { RobotEntity } from '../../entities';
import { Repository } from 'typeorm';
import { FindRobotUseCase } from './find-robot.use-case';

describe('FindRobotsUseCase', () => {
  it('should return a robot from the repository', async () => {
    const id = 1;

    const robot = {
      id,
      locationX: 1,
      locationY: 1,
      createdAt: new Date(),
    } as RobotEntity;

    const mockRepository = {
      findOneBy: jest.fn().mockReturnValue(robot),
    } as unknown as Repository<RobotEntity>;

    const useCase = new FindRobotUseCase(mockRepository);
    const output = await useCase.run(id);

    expect(output).toStrictEqual(robot);
  });
});
