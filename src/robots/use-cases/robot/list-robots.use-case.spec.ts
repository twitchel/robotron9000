import { RobotEntity } from '../../entities';
import { Repository } from 'typeorm';
import { ListRobotsUseCase } from './list-robots.use-case';

describe('ListRobotsUseCase', () => {
  it('should return a list of robots from the repository', async () => {
    const robot = {
      id: 1,
      locationX: 1,
      locationY: 1,
      createdAt: new Date(),
    } as RobotEntity;

    const mockRepository = {
      find: jest.fn().mockReturnValue([robot]),
    } as unknown as Repository<RobotEntity>;

    const useCase = new ListRobotsUseCase(mockRepository);
    const output = await useCase.run();

    expect(output).toStrictEqual([robot]);
  });
});
