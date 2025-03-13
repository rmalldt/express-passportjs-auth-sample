import express from 'express';

import { getCart, postCart } from '../controllers/cartController.mjs';
import { isAuth } from '../middleware/isAuth.mjs';

const router = express.Router();

router.get('/', isAuth, getCart);

router.post('/', isAuth, postCart);

export default router;
