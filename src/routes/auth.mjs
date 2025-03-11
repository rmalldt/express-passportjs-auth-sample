import express from 'express';
import passport from 'passport';
import { checkSchema } from 'express-validator';

import { userValidationSchema } from '../utils/validationSchemas.mjs';
import {
  postSignup,
  postLogin,
  getStatus,
  postLogout,
} from '../controllers/authController.mjs';

const router = express.Router();

router.post('/signup', checkSchema(userValidationSchema), postSignup);

/**
 * Passport authentication strategy options:
 *  - local   => email, password
 *  - google
 * The passport.authenticate('local') will call the local-strategy.mjs verify function
 * which is imported in index.mjs.
 */
router.post('/login', passport.authenticate('local'), postLogin);

router.get('/status', getStatus);

router.post('/logout', postLogout);

export default router;
