import { Body, Controller, Get, Post } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly service: PortfolioService) {}

  @Post()
  create(
    @Body('name') name: string,
    @Body('initialCapital') initialCapital: number,
  ) {
    return this.service.create(name, initialCapital);
  }

  @Get()
  list() {
    return this.service.findAll();
  }
}
