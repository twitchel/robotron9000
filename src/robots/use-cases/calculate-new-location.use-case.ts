import { LocationDto } from '../dtos/location.dto';
import {
  Direction,
  DIRECTION_EAST,
  DIRECTION_NORTH,
  DIRECTION_SOUTH,
  DIRECTION_WEST,
  GRID_MAX,
  GRID_MIN,
  ValidDirections,
} from '../../constants';
import { OutOfBoundsError } from '../error/out-of-bounds.error';
import { Injectable } from '@nestjs/common';
import { InvalidDirectionError } from '../error/invalid-direction.error';

const movementCallbacks: Record<
  Direction,
  (location: LocationDto) => LocationDto
> = {
  [DIRECTION_NORTH]: (location: LocationDto) => {
    return new LocationDto(location.locationX, location.locationY - 1);
  },
  [DIRECTION_SOUTH]: (location: LocationDto) => {
    return new LocationDto(location.locationX, location.locationY + 1);
  },
  [DIRECTION_EAST]: (location: LocationDto) => {
    return new LocationDto(location.locationX + 1, location.locationY);
  },
  [DIRECTION_WEST]: (location: LocationDto) => {
    return new LocationDto(location.locationX - 1, location.locationY);
  },
};

@Injectable()
export class CalculateNewLocationUseCase {
  public run(currentLocation: LocationDto, direction: Direction): LocationDto {
    if (!ValidDirections.includes(direction)) {
      throw new InvalidDirectionError();
    }

    const newLocation = movementCallbacks[direction](currentLocation);

    if (
      newLocation.locationX > GRID_MAX ||
      newLocation.locationX < GRID_MIN ||
      newLocation.locationY > GRID_MAX ||
      newLocation.locationY < GRID_MIN
    ) {
      throw new OutOfBoundsError();
    }

    return newLocation;
  }
}
