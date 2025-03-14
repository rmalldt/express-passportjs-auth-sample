import express from 'express';
import passport from 'passport';
import { checkSchema } from 'express-validator';

import { userValidationSchema } from '../utils/validation-schemas.mjs';
import {
  postSignup,
  postLogin,
  getStatus,
  postLogout,
  getGoogleCallbackHandler,
} from '../controllers/auth-controller.mjs';
import { isAuth } from '../middleware/is-auth.mjs';

const router = express.Router();

router.post('/signup', checkSchema(userValidationSchema), postSignup);

router.post('/login', postLogin);
router.get(
  '/status',
  passport.authenticate('jwt', { session: false }),
  getStatus
);
router.post('/logout', postLogout);

/**
 * Google strategy:
 *  - The first endpoint '/google' invokes passport.authentication('google')
 *    which redirects user to 3rd party (Google) platform for authorization.
 *
 *  - On authorization, google redirects to callback URL '/google/callback'
 *    with query params 'code' and 'scope', which invokes the second
 *    passport.authenticate('google') that calls google-strategy.mjs verify function
 *    which is imported in index.mjs.
 *      - In the verify function, we access the google profile, accessToken and
 *        refreshToken via query param 'code'
 */
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get(
  '/google/callback',
  passport.authenticate('google'),
  getGoogleCallbackHandler
);

export default router;
