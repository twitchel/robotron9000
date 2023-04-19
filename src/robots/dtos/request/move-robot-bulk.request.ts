import { IsIn, IsNotEmpty } from 'class-validator';
import { ValidDirections } from '../../../constants';

export class MoveRobotBulkRequest {
  @IsNotEmpty()
  movements: string;
}
