import {
  Direction,
  DIRECTION_EAST,
  DIRECTION_NORTH,
  DIRECTION_SOUTH,
  DIRECTION_WEST,
} from '../../../constants';
import { ProcessMovementsUseCase } from './process-movements.use-case';
import { InvalidDirectionError } from '../../error/invalid-direction.error';

describe('ProcessMovementsUseCase', () => {
  let useCase: ProcessMovementsUseCase;

  beforeEach(() => {
    useCase = new ProcessMovementsUseCase();
  });

  describe('valid test cases', () => {
    it.each([
      [
        'N S E W',
        [DIRECTION_NORTH, DIRECTION_SOUTH, DIRECTION_EAST, DIRECTION_WEST],
      ],
      [
        'N S E  W',
        [DIRECTION_NORTH, DIRECTION_SOUTH, DIRECTION_EAST, DIRECTION_WEST],
      ],
      [
        'N s E w',
        [DIRECTION_NORTH, DIRECTION_SOUTH, DIRECTION_EAST, DIRECTION_WEST],
      ],
    ])(
      'should successfully process a valid set of movements (%s)',
      (input: string, output: Direction[]) => {
        expect(useCase.run(input)).toStrictEqual(output);
      },
    );
  });

  describe('invalid test cases', () => {
    it.each([['N S @'], ['N S A  W'], ['N s E EE']])(
      'should throw an InvalidDirectionError on an invalid set of movements (%s)',
      (input: string) => {
        expect(() => useCase.run(input)).toThrow(InvalidDirectionError);
      },
    );
  });
});
