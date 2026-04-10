import { Document, Schema, model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  price: number;
  category: string;
  stock: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    stock: { type: Number, required: true, min: 0 },
    description: { type: String, default: '' }
  },
  { timestamps: true }
);

export const Product = model<IProduct>('Product', productSchema);
