import { Controller, Get, Param } from '@nestjs/common';
import { NavService } from './nav.service';

@Controller('nav')
export class NavController {
  constructor(private readonly service: NavService) {}

  @Get(':portfolioId')
  get(@Param('portfolioId') id: string) {
    return this.service.compute(id);
  }
}
