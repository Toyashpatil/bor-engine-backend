import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TradeDocument = Trade & Document;

@Schema({ timestamps: true })
export class Trade {
  @Prop({ required: true })
  portfolioId: string;

  @Prop({ required: true })
  symbol: string;

  @Prop({ enum: ['BUY', 'SELL'], required: true })
  side: 'BUY' | 'SELL';

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  executedAt: Date;
}

export const TradeSchema =
  SchemaFactory.createForClass(Trade);
