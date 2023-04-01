import express, { Router } from 'express';
import cartController from '../controllers/cartController';

const router: Router = express.Router();

router.get('/', cartController.getAll);
router.post('/', cartController.add);
router.put('/:id', cartController.update);
router.delete('/', cartController.clear);
router.delete('/:id', cartController.delete);

export default router;
