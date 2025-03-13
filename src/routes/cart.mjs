import express from 'express';

import { getCart, postCart } from '../controllers/cart-controller.mjs';
import { isAuth } from '../middleware/is-auth.mjs';

const router = express.Router();

router.get('/', isAuth, getCart);

router.post('/', isAuth, postCart);

export default router;
