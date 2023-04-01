import { NextFunction, Request, Response } from 'express';
import cartService from '../services/CartService';

class CartController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { limit = 10, page = 1 } = req.query;

      const cartItems = await cartService.getAll(+page, +limit);

      return res.status(200).json(cartItems);
    } catch (err) {
      next(err);
    }
  }
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { type, size, count } = req.body;
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: 'Parameter id is required' });
      }

      const updatedCartItem = await cartService.update({
        productId: id,
        type,
        size,
        count,
      });

      return res.status(200).json(updatedCartItem);
    } catch (err) {
      next(err);
    }
  }
  async add(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId, type, size, count } = req.body;

      const createdCartItem = await cartService.add({
        productId,
        type,
        size,
        count,
      });

      res.status(201).json(createdCartItem);
    } catch (err) {
      next(err);
    }
  }
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ message: 'parameter id is required' });
      }

      const deletedCartItem = await cartService.delete(id);

      return res.status(200).json(deletedCartItem);
    } catch (err) {
      next(err);
    }
  }
  async clear(req: Request, res: Response, next: NextFunction) {
    try {
      const isDeleted = await cartService.clear();

      res.status(200).json({ message: `Корзина успешно очищена`, isDeleted });
    } catch (err) {
      next(err);
    }
  }
}

export default new CartController();
