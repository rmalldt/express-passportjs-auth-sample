import express from 'express';

import { getCart, postCart } from '../controllers/cartController.mjs';

const router = express.Router();

router.get('/', getCart);

router.post('/', postCart);

export default router;
