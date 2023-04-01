import mongoose, { ObjectId, Schema, model } from 'mongoose';

export interface ICart {
  items: ICartItem[];
  totalPrice: number;
}

export interface ICartItem {
  productId: mongoose.Types.ObjectId;
  title: string;
  price: number;
  imageUrl: string;
  type: {
    id: number;
    title: string;
  };
  size: number;
  count: number;
}

const CartItemSchema = new Schema<ICartItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product' },
  title: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  type: {
    id: { type: Number, unique: true, required: true },
    title: { type: String, required: true },
  },
  size: { type: Number, required: true },
  count: {
    type: Number,
    required: true,
    min: [1, 'Quantity can not be less then 1.'],
  },
});

const CartSchema = new Schema<ICart>(
  {
    items: {
      type: [CartItemSchema],
      default: [],
    },
    totalPrice: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

export default model<ICart>('Cart', CartSchema);
