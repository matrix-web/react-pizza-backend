import Cart, { ICart, ICartItem } from '../models/Cart';

export const getCart = async () => {
  const carts = await Cart.find().populate({
    path: 'items.productId',
    select: 'id',
  });

  return carts[0];
};

export const calculateTotalPrice = (items: ICartItem[]): number => {
  return items.reduce((prev, item) => prev + item.price * item.count, 0);
};
