import { Router } from 'express';
import * as listingController from '../controllers/listing.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', listingController.getAll);
router.get('/mine', authMiddleware, listingController.getMine);
router.post('/', authMiddleware, listingController.create);
router.delete('/:id', authMiddleware, listingController.remove);

export default router;