import { LocationDto } from '../dtos/location.dto';
import { CalculateNewLocationUseCase } from './calculate-new-location.use-case';
import {
  DIRECTION_EAST,
  DIRECTION_NORTH,
  DIRECTION_SOUTH,
  DIRECTION_WEST,
} from '../../constants';
import { OutOfBoundsError } from '../error/out-of-bounds.error';

describe('CalculateNewLocationUseCaseTest', () => {
  let useCase: CalculateNewLocationUseCase;

  beforeAll(() => {
    useCase = new CalculateNewLocationUseCase();
  });

  describe('Valid Scenarios', () => {
    let initialLocation: LocationDto;
    beforeEach(() => {
      initialLocation = new LocationDto(5, 5);
    });

    it('should return a new location when moving N', () => {
      const newLocation = useCase.run(initialLocation, DIRECTION_NORTH);

      expect(newLocation.locationX).toBe(5);
      expect(newLocation.locationY).toBe(4);
    });

    it('should return a new location when moving S', () => {
      const newLocation = useCase.run(initialLocation, DIRECTION_SOUTH);

      expect(newLocation.locationX).toBe(5);
      expect(newLocation.locationY).toBe(6);
    });

    it('should return a new location when moving E', () => {
      const newLocation = useCase.run(initialLocation, DIRECTION_EAST);

      expect(newLocation.locationX).toBe(4);
      expect(newLocation.locationY).toBe(5);
    });

    it('should return a new location when moving W', () => {
      const newLocation = useCase.run(initialLocation, DIRECTION_WEST);

      expect(newLocation.locationX).toBe(6);
      expect(newLocation.locationY).toBe(5);
    });
  });

  describe('Error Scenarios', () => {
    it('should throw and error if the robot attempts to move out of bounds', () => {
      expect(() => useCase.run(new LocationDto(1, 1), DIRECTION_NORTH)).toThrow(
        OutOfBoundsError,
      );
    });
  });
});
