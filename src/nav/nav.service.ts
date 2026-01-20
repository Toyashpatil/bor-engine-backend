import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PositionService } from '../position/position.service';
import { CashService } from '../cash/cash.service';
import { MarketDataService } from '../market-data/market-data.service';

@Injectable()
export class NavService {
  constructor(
    private readonly positionService: PositionService,
    private readonly cashService: CashService,
    private readonly marketDataService: MarketDataService,
  ) {}

  /**
   * Compute NAV for a portfolio
   * - Positions derived from trades
   * - Cash derived from ledger
   * - Prices fetched live from Zerodha
   */
  async compute(portfolioId: string) {
    try {
      // 1️⃣ Derived positions
      const positions =
        await this.positionService.compute(portfolioId);

      // 2️⃣ Cash balance
      const cash =
        await this.cashService.balance(portfolioId);

      const symbols = Object.keys(positions);

      // 3️⃣ Empty portfolio case
      if (symbols.length === 0) {
        return {
          cash,
          equity: 0,
          nav: cash,
          unrealized: 0,
          positions: {},
        };
      }

      // 4️⃣ Live prices (batch from Zerodha)
      const prices =
        await this.marketDataService.getLTPBatch(
          symbols,
        );

      let equity = 0;
      let unrealized = 0;

      const enrichedPositions: Record<string, any> =
        {};

      // 5️⃣ Valuation loop
      for (const symbol of symbols) {
        const p = positions[symbol];
        const ltp = prices[symbol];

        if (ltp === undefined) {
          throw new Error(
            `Missing LTP for symbol: ${symbol}`,
          );
        }

        const marketValue = p.qty * ltp;
        const unrealizedPnl =
          (ltp - p.avg) * p.qty;

        equity += marketValue;
        unrealized += unrealizedPnl;

        enrichedPositions[symbol] = {
          quantity: p.qty,
          avgPrice: p.avg,
          ltp,
          marketValue,
          realizedPnl: p.realized,
          unrealizedPnl,
        };
      }

      // 6️⃣ Final NAV
      return {
        cash,
        equity,
        nav: cash + equity,
        unrealized,
        positions: enrichedPositions,
      };
    } catch (err: any) {
      console.error(
        'NAV COMPUTATION ERROR:',
        err.message,
      );
      throw new InternalServerErrorException(
        'Failed to compute NAV',
      );
    }
  }
}
