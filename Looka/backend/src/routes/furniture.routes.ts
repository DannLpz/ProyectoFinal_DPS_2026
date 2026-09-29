import { Router } from 'express';
import * as furnitureController from '../controllers/furniture.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/default', furnitureController.getDefault);
router.get('/generated', authMiddleware, furnitureController.getGenerated);

export default router;