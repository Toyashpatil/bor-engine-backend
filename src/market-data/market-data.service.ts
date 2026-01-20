import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import * as https from 'https';

@Injectable()
export class MarketDataService {
  private readonly baseUrl = 'https://api.kite.trade';
  private readonly apiKey = process.env.KITE_API_KEY as string;
  private readonly accessToken = process.env.KITE_ACCESS_TOKEN as string;

  async getLTPBatch(
    symbols: string[],
  ): Promise<Record<string, number>> {
    try {
      // 🔑 Force correct Zerodha param format
      const query = symbols
        .map((s) => `i=NSE:${s}`)
        .join('&');

      const url = `${this.baseUrl}/quote/ltp?${query}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `token ${this.apiKey}:${this.accessToken}`,
          'X-Kite-Version': '3',
        },
        // 🔥 Fix Windows TLS issues
        httpsAgent: new https.Agent({
          keepAlive: true,
        }),
        timeout: 10000,
      });

      if (!response.data?.data) {
        throw new Error(
          `Invalid Zerodha response: ${JSON.stringify(
            response.data,
          )}`,
        );
      }

      const prices: Record<string, number> = {};

      for (const key of Object.keys(response.data.data)) {
        prices[key.split(':')[1]] =
          response.data.data[key].last_price;
      }

      return prices;
    } catch (err: any) {
      console.error(
        'ZERODHA NETWORK ERROR:',
        err.message,
      );
      console.error(
        'ZERODHA ERROR CODE:',
        err.code,
      );

      throw new InternalServerErrorException(
        'Failed to fetch LTP from Zerodha',
      );
    }
  }
}
