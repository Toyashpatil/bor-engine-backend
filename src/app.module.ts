import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PortfolioModule } from './portfolio/portfolio.module';
import { TradeModule } from './trade/trade.module';
import { CashModule } from './cash/cash.module';
import { MarketDataModule } from './market-data/market-data.module';
import { PositionModule } from './position/position.module';
import { NavModule } from './nav/nav.module';
import { MongoModule } from './database/mongo.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({
      isGlobal: true,
    }),MongoModule, PortfolioModule, TradeModule, CashModule, MarketDataModule, PositionModule, NavModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
