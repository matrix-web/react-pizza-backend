import express, { Router } from 'express';
import productController from '../controllers/productControllers';

const router: Router = express.Router();

router.post('/', productController.create);
router.get('/', productController.getAll);
router.get('/:id', productController.getById);
router.delete('/id', productController.delete);

export default router;
