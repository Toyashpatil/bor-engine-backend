import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CashLedger,
  CashLedgerDocument,
} from './cash.schema';

@Injectable()
export class CashService {
  constructor(
    @InjectModel(CashLedger.name)
    private readonly cashModel: Model<CashLedgerDocument>,
  ) {}

  record(entry: Partial<CashLedger>) {
    return this.cashModel.create(entry);
  }

  async balance(portfolioId: string): Promise<number> {
    const res = await this.cashModel.aggregate([
      { $match: { portfolioId } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    return res[0]?.total || 0;
  }
}
