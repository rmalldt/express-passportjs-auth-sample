import express from 'express';
import {
  postLogin,
  getStatus,
  postLogout,
} from '../controllers/mock-controller.mjs';

const router = express.Router();

router.post('/login', postLogin);

router.get('/status', getStatus);

router.post('/logout', postLogout);

export default router;
