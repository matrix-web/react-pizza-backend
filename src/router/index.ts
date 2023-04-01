import express from 'express';
import productsRouter from './productsRouter';
import cartRouter from './cartRouter';

const router = express.Router();

router.use('/products', productsRouter);
router.use('/carts', cartRouter);

export default router;
