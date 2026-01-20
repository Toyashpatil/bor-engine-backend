import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Trade, TradeSchema } from './trade.schema';
import { TradeService } from './trade.service';
import { TradeController } from './trade.controller';
import { CashModule } from '../cash/cash.module';
import { MarketDataModule } from '../market-data/market-data.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Trade.name, schema: TradeSchema },
    ]),
    CashModule,
    MarketDataModule,
  ],
  providers: [TradeService],
  controllers: [TradeController],
})
export class TradeModule {}
