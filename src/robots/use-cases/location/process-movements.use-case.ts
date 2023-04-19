import { Injectable } from '@nestjs/common';
import { Direction, ValidDirections } from '../../../constants';
import { InvalidDirectionError } from '../../error/invalid-direction.error';

@Injectable()
export class ProcessMovementsUseCase {
  public run(movements: string): Direction[] {
    const movementsArray = movements.split(' ').filter((item) => item);

    if (!movementsArray.length) {
      throw new InvalidDirectionError();
    }

    const movementsUppercase = movementsArray.map((item) => item.toUpperCase());

    movementsUppercase.forEach((item) => {
      if (!ValidDirections.includes(item)) {
        throw new InvalidDirectionError();
      }
    });

    return movementsUppercase.map((item) => item as Direction);
  }
}
