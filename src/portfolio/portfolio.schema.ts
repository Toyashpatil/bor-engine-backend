import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PortfolioDocument = Portfolio & Document;

@Schema({ timestamps: true })
export class Portfolio {
  @Prop({ required: true })
  name: string;

  @Prop({ default: 'INR' })
  baseCurrency: string;

  @Prop({ required: true })
  initialCapital: number;
}

export const PortfolioSchema =
  SchemaFactory.createForClass(Portfolio);
