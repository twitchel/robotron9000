import { LocationDto } from '../dtos/location.dto';
import {
  Direction,
  DIRECTION_EAST,
  DIRECTION_NORTH,
  DIRECTION_SOUTH,
  DIRECTION_WEST,
  GRID_MAX,
  GRID_MIN,
} from '../../constants';
import { OutOfBoundsError } from '../error/out-of-bounds.error';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CalculateNewLocationUseCase {
  public run(currentLocation: LocationDto, direction: Direction): LocationDto {
    let locationX = currentLocation.locationX ?? 1;
    let locationY = currentLocation.locationY ?? 1;

    switch (direction) {
      case DIRECTION_NORTH:
        locationY--;
        break;
      case DIRECTION_SOUTH:
        locationY++;
        break;
      case DIRECTION_EAST:
        locationX++;
        break;
      case DIRECTION_WEST:
        locationX--;
        break;
    }

    if (
      locationX > GRID_MAX ||
      locationX < GRID_MIN ||
      locationY > GRID_MAX ||
      locationY < GRID_MIN
    ) {
      throw new OutOfBoundsError();
    }

    return new LocationDto(locationX, locationY);
  }
}
