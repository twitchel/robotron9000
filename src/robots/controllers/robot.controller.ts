import {
  BadRequestException,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { RobotEntity } from '../entities';
import { ListRobotsUseCase } from '../use-cases/robot/list-robots.use-case';
import { CreateRobotUseCase } from '../use-cases/robot/create-robot.use-case';
import { GridReferenceContainsBotError } from '../error/grid-reference-contains-bot.error';
import { Request } from 'express';
import { MoveRobotUseCase } from '../use-cases/location/move-robot.use-case';
import { FindRobotUseCase } from '../use-cases/robot/find-robot.use-case';
import { NotFoundError } from 'rxjs';
import { Direction, ValidDirections } from '../../constants';

@Controller()
export class RobotController {
  constructor(
    private readonly listRobotsUseCase: ListRobotsUseCase,
    private readonly createRobotUseCase: CreateRobotUseCase,
    private readonly findRobotUseCase: FindRobotUseCase,
    private readonly moveRobotUseCase: MoveRobotUseCase,
  ) {}

  @Get('/api/robots')
  public async apiListRobots(): Promise<RobotEntity[]> {
    return this.listRobotsUseCase.run();
  }

  @Post('/api/robots')
  public async apiCreateRobot(): Promise<RobotEntity> {
    try {
      return await this.createRobotUseCase.run();
    } catch (e) {
      if (e instanceof GridReferenceContainsBotError) {
        throw new HttpException(
          'Cannot create robot, a robot is currently sitting in position 1, 1',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  @Post('/api/robots/:id/move/:direction')
  public async apiMoveRobot(
    @Param('id') id: string,
    @Param('direction') direction: Direction,
  ): Promise<RobotEntity> {
    try {
      const robot = await this.findRobotUseCase.run(Number(id));

      return await this.moveRobotUseCase.run(robot, direction);
    } catch (e) {
      if (e instanceof GridReferenceContainsBotError) {
        throw new HttpException(
          'Cannot move robot, a robot is currently sitting in position',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
      }
    }
  }
}
