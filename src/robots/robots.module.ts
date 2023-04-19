import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RobotEntity } from './entities';
import { CalculateNewLocationUseCase } from './use-cases/calculate-new-location.use-case';
import { RobotController } from './controllers/robot.controller';
import { ListRobotsUseCase } from './use-cases/robot/list-robots.use-case';
import { CreateRobotUseCase } from './use-cases/robot/create-robot.use-case';
import { FindRobotUseCase } from './use-cases/robot/find-robot.use-case';
import { MoveRobotUseCase } from './use-cases/location/move-robot.use-case';
import { FindRobotAtGridReferenceUseCase } from './use-cases/location/find-robot-at-grid-reference.use-case';
import { ProcessMovementsUseCase } from './use-cases/location/process-movements.use-case';
import { BulkMoveRobotUseCase } from './use-cases/location/bulk-move-robot.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([RobotEntity])],
  providers: [
    CalculateNewLocationUseCase,
    ListRobotsUseCase,
    CreateRobotUseCase,
    FindRobotUseCase,
    FindRobotAtGridReferenceUseCase,
    MoveRobotUseCase,
    BulkMoveRobotUseCase,
    ProcessMovementsUseCase,
  ],
  controllers: [RobotController],
})
export class RobotsModule {}
