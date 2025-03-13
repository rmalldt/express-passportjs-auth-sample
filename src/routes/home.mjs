import express from 'express';

import { getHome } from '../controllers/home-controller.mjs';

const router = express.Router();

router.get('/', getHome);

export default router;
