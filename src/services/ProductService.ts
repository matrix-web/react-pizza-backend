import { SortOrder } from 'mongoose';
import Product from '../models/Product';
import { IProduct } from '../models/Product';

class ProductService {
  async create(product: IProduct) {
    const createdProduct = await Product.create(product);

    return createdProduct;
  }
  async getAll(params: any) {
    const {
      limit = 4,
      order,
      search,
      sortBy = 'rating',
      page = 1,
      category,
    } = params;

    const perPage = +limit;
    const orderBy = order === 'asc' ? 1 : -1;
    const pageNumber = +page || 1;
    let totalCount = 0;
    let products = null;
    let query = Product.find();
    totalCount = await Product.find().count();

    if (search) {
      const searchObject = { $text: { $search: `${search}` } };
      query = Product.find(searchObject);
      totalCount = await Product.find(searchObject).count();
    }

    if (category && +category !== 1) {
      totalCount = await Product.find().where({ category }).count();
      query = query.where({ category });
    }

    if (sortBy) {
      query = query.sort({ [`${sortBy}`]: orderBy });
    }

    query = query.skip((pageNumber - 1) * perPage).limit(perPage);

    products = await query;

    return {
      products,
      meta: {
        page: pageNumber,
        limit: perPage,
        totalPages: Math.ceil(totalCount / perPage),
        totalCount,
      },
    };
  }
  async getById(id: string) {
    const product = await Product.findOne({ _id: id });

    return product;
  }
  async delete(id: string) {
    const deletedProduct = await Product.findByIdAndDelete({ _id: id });

    return deletedProduct;
  }
}

export default new ProductService();
