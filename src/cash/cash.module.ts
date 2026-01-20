import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CashLedger, CashLedgerSchema } from './cash.schema';
import { CashService } from './cash.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CashLedger.name, schema: CashLedgerSchema },
    ]),
  ],
  providers: [CashService],
  exports: [CashService],
})
export class CashModule {}
