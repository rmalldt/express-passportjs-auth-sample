import express from 'express';

import { postCreateUser } from '../controllers/userController.mjs';

const router = express.Router();

router.post('/create', postCreateUser);

export default router;
