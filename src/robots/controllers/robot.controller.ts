import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { RobotEntity } from '../entities';
import { ListRobotsUseCase } from '../use-cases/robot/list-robots.use-case';
import { CreateRobotUseCase } from '../use-cases/robot/create-robot.use-case';
import { GridReferenceContainsBotError } from '../error/grid-reference-contains-bot.error';
import { MoveRobotUseCase } from '../use-cases/location/move-robot.use-case';
import { FindRobotUseCase } from '../use-cases/robot/find-robot.use-case';
import { Direction } from '../../constants';
import { EntityNotFoundError } from 'typeorm';
import { MoveRobotBulkRequest } from '../dtos/request/move-robot-bulk.request';
import { InvalidDirectionError } from '../error/invalid-direction.error';
import { BulkMoveRobotUseCase } from '../use-cases/location/bulk-move-robot.use-case';
import { OutOfBoundsError } from '../error/out-of-bounds.error';

@Controller()
export class RobotController {
  constructor(
    private readonly listRobotsUseCase: ListRobotsUseCase,
    private readonly createRobotUseCase: CreateRobotUseCase,
    private readonly findRobotUseCase: FindRobotUseCase,
    private readonly moveRobotUseCase: MoveRobotUseCase,
    private readonly bulkMoveRobotUseCase: BulkMoveRobotUseCase,
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

  @Post('/api/robots/:id/move')
  public async apiMoveRobotBatch(
    @Param('id') id: string,
    @Body() moveRobotBulkRequest: MoveRobotBulkRequest,
  ): Promise<RobotEntity> {
    try {
      const robot = await this.findRobotUseCase.run(Number(id));

      return await this.bulkMoveRobotUseCase.run(
        robot,
        moveRobotBulkRequest.movements,
      );
    } catch (e) {
      if (e instanceof GridReferenceContainsBotError) {
        throw new HttpException(
          `Robot would collide with another robot in this path, cancelling movement`,
          HttpStatus.BAD_REQUEST,
        );
      } else if (e instanceof InvalidDirectionError) {
        throw new HttpException(
          'Movements provided invalid, should be in format "N S E W"',
          HttpStatus.BAD_REQUEST,
        );
      } else if (e instanceof OutOfBoundsError) {
        throw new HttpException(
          `Robot would be moving out of bounds, cancelling movements`,
          HttpStatus.BAD_REQUEST,
        );
      } else if (e instanceof EntityNotFoundError) {
        throw new HttpException(
          `Robot ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
      }
    }
  }
  @Post('/api/robots/:id/move/:direction')
  public async apiMoveRobotOnce(
    @Param('id') id: string,
    @Param('direction') direction: Direction,
  ): Promise<RobotEntity> {
    try {
      const robot = await this.findRobotUseCase.run(Number(id));

      return await this.moveRobotUseCase.run(robot, direction);
    } catch (e) {
      if (e instanceof GridReferenceContainsBotError) {
        throw new HttpException(
          `Cannot move robot, another robot is currently sitting in the direction ${direction} of this bot`,
          HttpStatus.BAD_REQUEST,
        );
      } else if (e instanceof OutOfBoundsError) {
        throw new HttpException(
          `Robot would be moving out of bounds, cancelling movement`,
          HttpStatus.BAD_REQUEST,
        );
      } else if (e instanceof EntityNotFoundError) {
        throw new HttpException(
          `Robot ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
      }
    }
  }
}
