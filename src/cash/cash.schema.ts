import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CashLedgerDocument = CashLedger & Document;

@Schema({ timestamps: true })
export class CashLedger {
  @Prop({ required: true })
  portfolioId: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  amount: number;

  @Prop()
  referenceId: string;
}

export const CashLedgerSchema =
  SchemaFactory.createForClass(CashLedger);
