import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Robotron 9000 welcomes you!  🤖';
  }
}
