import { Body, Controller, Post } from '@nestjs/common';
import { TradeService } from './trade.service';

@Controller('trade')
export class TradeController {
  constructor(private readonly service: TradeService) {}

  @Post()
  placeTrade(
    @Body('portfolioId') portfolioId: string,
    @Body('symbol') symbol: string,
    @Body('side') side: 'BUY' | 'SELL',
    @Body('quantity') quantity: number,
  ) {
    return this.service.placeMarketTrade({
      portfolioId,
      symbol,
      side,
      quantity,
    });
  }
}
