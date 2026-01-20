import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Trade, TradeSchema } from '../trade/trade.schema';
import { PositionService } from './position.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Trade.name, schema: TradeSchema },
    ]),
  ],
  providers: [PositionService],
  exports: [PositionService],
})
export class PositionModule {}
