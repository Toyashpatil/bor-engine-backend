import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trade, TradeDocument } from './trade.schema';
import { CashService } from '../cash/cash.service';

@Injectable()
export class TradeService {
  constructor(
    @InjectModel(Trade.name)
    private readonly tradeModel: Model<TradeDocument>,
    private readonly cashService: CashService,
  ) {}

  async createTrade(dto: Trade) {
    const trade = await this.tradeModel.create(dto);

    const cashImpact =
      dto.side === 'BUY'
        ? -dto.quantity * dto.price
        : dto.quantity * dto.price;

    await this.cashService.record({
      portfolioId: dto.portfolioId,
      type: 'TRADE',
      amount: cashImpact,
      referenceId: trade._id.toString(),
    });

    return trade;
  }
}
