import { Module } from '@nestjs/common';
import { NavService } from './nav.service';
import { NavController } from './nav.controller';
import { PositionModule } from '../position/position.module';
import { CashModule } from '../cash/cash.module';
import { MarketDataModule } from '../market-data/market-data.module';

@Module({
  imports: [
    PositionModule,
    CashModule,
    MarketDataModule,
  ],
  providers: [NavService],
  controllers: [NavController],
})
export class NavModule {}
