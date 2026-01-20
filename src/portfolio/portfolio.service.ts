import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Portfolio, PortfolioDocument } from './portfolio.schema';
import { CashService } from '../cash/cash.service';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectModel(Portfolio.name)
    private readonly portfolioModel: Model<PortfolioDocument>,
    private readonly cashService: CashService,
  ) {}

  async create(name: string, initialCapital: number) {
    const portfolio = await this.portfolioModel.create({
      name,
      initialCapital,
    });

    // 🔑 Auto fund portfolio
    await this.cashService.record({
      portfolioId: portfolio._id.toString(),
      type: 'DEPOSIT',
      amount: initialCapital,
      referenceId: 'INITIAL_FUNDING',
    });

    return portfolio;
  }

  findAll() {
    return this.portfolioModel.find();
  }
}
