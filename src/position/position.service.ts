import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trade, TradeDocument } from '../trade/trade.schema';

@Injectable()
export class PositionService {
  constructor(
    @InjectModel(Trade.name)
    private readonly tradeModel: Model<TradeDocument>,
  ) {}

  async compute(portfolioId: string) {
    const trades = await this.tradeModel
      .find({ portfolioId })
      .sort({ executedAt: 1 });

    const positions: any = {};

    for (const t of trades) {
      if (!positions[t.symbol]) {
        positions[t.symbol] = {
          qty: 0,
          avg: 0,
          realized: 0,
        };
      }

      const p = positions[t.symbol];

      if (t.side === 'BUY') {
        const cost = p.qty * p.avg + t.quantity * t.price;
        p.qty += t.quantity;
        p.avg = cost / p.qty;
      } else {
        p.realized +=
          (t.price - p.avg) * t.quantity;
        p.qty -= t.quantity;
      }
    }

    return positions;
  }
}
