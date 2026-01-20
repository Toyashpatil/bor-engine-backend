import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trade, TradeDocument } from './trade.schema';
import { CashService } from '../cash/cash.service';
import { MarketDataService } from '../market-data/market-data.service';

@Injectable()
export class TradeService {
  constructor(
    @InjectModel(Trade.name)
    private readonly tradeModel: Model<TradeDocument>,
    private readonly cashService: CashService,
    private readonly marketDataService: MarketDataService,
  ) {}

  async placeMarketTrade(dto: {
    portfolioId: string;
    symbol: string;
    side: 'BUY' | 'SELL';
    quantity: number;
  }) {
    if (dto.quantity <= 0) {
      throw new BadRequestException(
        'Quantity must be positive',
      );
    }

    // 1️⃣ Fetch live price from Zerodha
    const prices =
      await this.marketDataService.getLTPBatch([
        dto.symbol,
      ]);

    const price = prices[dto.symbol];

    if (!price) {
      throw new BadRequestException(
        'Unable to fetch live price',
      );
    }

    // 2️⃣ Create trade
    const trade = await this.tradeModel.create({
      portfolioId: dto.portfolioId,
      symbol: dto.symbol,
      side: dto.side,
      quantity: dto.quantity,
      price,
      executedAt: new Date(),
    });

    // 3️⃣ Cash impact
    const cashImpact =
      dto.side === 'BUY'
        ? -dto.quantity * price
        : dto.quantity * price;

    await this.cashService.record({
      portfolioId: dto.portfolioId,
      type: 'TRADE',
      amount: cashImpact,
      referenceId: trade._id.toString(),
    });

    return {
      tradeId: trade._id,
      symbol: dto.symbol,
      side: dto.side,
      quantity: dto.quantity,
      executedPrice: price,
      executedAt: trade.executedAt,
    };
  }
}
