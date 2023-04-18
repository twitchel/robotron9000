import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RobotEntity } from './entities';
import { CalculateNewLocationUseCase } from './use-cases/calculate-new-location.use-case';
import { RobotController } from './controllers/robot.controller';
import { ListRobotsUseCase } from './use-cases/robot/list-robots.use-case';
import { CreateRobotUseCase } from './use-cases/robot/create-robot.use-case';
import { IsGridReferenceEmptyUseCase } from './use-cases/is-grid-reference-empty.use-case';
import { FindRobotUseCase } from './use-cases/robot/find-robot.use-case';
import { MoveRobotUseCase } from './use-cases/location/move-robot.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([RobotEntity])],
  providers: [
    CalculateNewLocationUseCase,
    IsGridReferenceEmptyUseCase,
    ListRobotsUseCase,
    CreateRobotUseCase,
    FindRobotUseCase,
    MoveRobotUseCase,
  ],
  controllers: [RobotController],
})
export class RobotsModule {}
