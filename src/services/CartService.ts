import mongoose from 'mongoose';
import Cart, { ICartItem } from '../models/Cart';
import Product from '../models/Product';
import { getCart, calculateTotalPrice } from '../utils';
import { PRODUCT_TYPES, DEFAULT_PRODUCT_SIZE } from '../consts';

interface IParams {
  productId: string;
  type: { id: number; title: string };
  size: number;
  count: number;
}

class CartService {
  async getAll(page: number, limit: number) {
    const from = (page - 1) * limit;
    const to = page * limit;
    let totalPages = 0;

    const cart = await getCart();

    if (cart) {
      totalPages = Math.ceil(cart.items.length / limit);
      const pageItems = cart.items.slice(from, to);

      return {
        items: pageItems,
        totalPrice: cart.totalPrice,
        meta: {
          limit,
          totalPages,
          currentPage: page,
          totalCount: cart.items.length,
        },
      };
    }
  }
  async update(params: IParams) {
    const { productId, type, size, count } = params;

    const id = new mongoose.Types.ObjectId(productId);
    const cart = await getCart();
    const productDetails = await Product.findById(id);
    const cartItems = cart ? cart.items : ([] as ICartItem[]);

    const newTypeIndex: number =
      productDetails?.types.findIndex((typeItem) => typeItem === type.id) ?? 0;
    const newSize: number =
      productDetails?.sizes.find((sizeItem) => sizeItem === size) ??
      DEFAULT_PRODUCT_SIZE;

    if (cart) {
      const productIndexFound = cartItems.findIndex((item) =>
        item.productId.equals(id),
      );

      if (productIndexFound !== -1 && count <= 0) {
        cartItems.splice(productIndexFound, 1);

        if (cartItems.length) {
          cart.totalPrice = calculateTotalPrice(cartItems);
        } else {
          cart.totalPrice = 0;
        }
      } else if (productIndexFound !== -1 && count > 0) {
        cartItems[productIndexFound].count = count;
        cart.totalPrice = calculateTotalPrice(cartItems);

        if (cartItems[productIndexFound].size !== size) {
          cartItems[productIndexFound].size = newSize;
        }

        if (cartItems[productIndexFound].type.id !== type.id) {
          cartItems[productIndexFound].type = PRODUCT_TYPES[newTypeIndex];
        }
      }

      const data = await cart.save();
      return {
        items: data.items,
        totalPrice: data.totalPrice,
      };
    }
  }
  async add(item: IParams) {
    const { productId, type, size, count } = item;

    const cart = await getCart();
    const id = new mongoose.Types.ObjectId(productId);
    const cartItems = cart ? cart.items : ([] as ICartItem[]);

    const productDetails = await Product.findById(id);

    const newTypeIndex: number =
      productDetails?.types.findIndex((typeItem) => typeItem === type.id) ?? 0;
    const newSize: number =
      productDetails?.sizes.find((sizeItem) => sizeItem === size) ??
      DEFAULT_PRODUCT_SIZE;

    if (cart) {
      const productIndexFound = cartItems.findIndex((item) =>
        item.productId.equals(id),
      );

      if (productIndexFound === -1) {
        if (productDetails) {
          const productToCart = {
            productId: id,
            title: productDetails.title,
            price: productDetails.price,
            imageUrl: productDetails.imageUrl,
            type: PRODUCT_TYPES[newTypeIndex],
            size: newSize,
            count,
          };

          cartItems.push(productToCart);
          cart.totalPrice = calculateTotalPrice(cartItems);
        }
      }

      const data = await cart.save();
      return data;
    } else {
      if (productDetails) {
        const productToCart = {
          productId: id,
          title: productDetails.title,
          price: productDetails.price,
          imageUrl: productDetails.imageUrl,
          type: PRODUCT_TYPES[newTypeIndex],
          size: newSize,
          count,
        };

        const createdCartItem = await Cart.create({
          items: [productToCart],
          totalPrice: productDetails.price * count,
        });

        return createdCartItem;
      }
    }
  }
  async delete(id: string) {
    const cart = await getCart();

    const objId = new mongoose.Types.ObjectId(id);

    if (cart) {
      const findIndex = cart.items.findIndex((item) =>
        item.productId.equals(objId),
      );

      if (findIndex >= 0) {
        const deletedCartItem = cart.items.splice(findIndex, 1)[0];
        cart.totalPrice = calculateTotalPrice(cart.items);

        await cart.save();

        return deletedCartItem;
      }
    }
  }
  async clear() {
    const cart = await getCart();

    if (cart) {
      cart.items = [];
      cart.totalPrice = 0;

      await cart.save();
    }
  }
}

export default new CartService();
