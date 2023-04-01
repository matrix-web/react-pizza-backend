import { NextFunction, Request, Response } from 'express';
import productService from '../services/ProductService';
import ApiError from '../exceptions/apiError';

class ProductController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { imageUrl, title, types, sizes, price, category, rating } =
        req.body;

      const createdProduct = await productService.create({
        imageUrl,
        title,
        types,
        sizes,
        price,
        category,
        rating,
      });

      res.status(201).json(createdProduct);
    } catch (err) {
      next(err);
    }
  }
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        category = '',
        limit = 4,
        order,
        search,
        sortBy = 'rating',
        page = 1,
      } = req.query;

      const data = await productService.getAll({
        category,
        limit,
        order,
        search,
        sortBy,
        page,
      });

      return res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  }
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        return next(ApiError.badRequest(`Parameter id is required`));
      }

      const product = await productService.getById(id);

      return res.status(200).json(product);
    } catch (err) {
      next(err);
    }
  }
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        return next(ApiError.badRequest(`Parameter id is required`));
      }

      const deletedProduct = await productService.delete(id);

      return res.status(200).json(deletedProduct);
    } catch (err) {
      next(err);
    }
  }
}

export default new ProductController();
