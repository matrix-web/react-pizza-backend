import { Schema, model } from 'mongoose';

export interface IProduct {
  imageUrl: string;
  title: string;
  types: number[];
  sizes: number[];
  price: number;
  category: number;
  rating?: number;
}

const ProductSchema = new Schema<IProduct>({
  imageUrl: { type: String, required: true },
  title: { type: String, required: true, unique: true },
  types: { type: [Number], required: true },
  sizes: { type: [Number], required: true },
  price: { type: Number, required: true },
  category: { type: Number, required: true },
  rating: { type: Number, required: true, default: 0 },
});

ProductSchema.index({ name: 'text', title: 'text' });

export default model<IProduct>('Product', ProductSchema);
