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
router.get('/status', isAuth, getStatus);
router.post('/logout', isAuth, postLogout);

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
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
    failureRedirect: '/',
  })
);
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  getGoogleCallbackHandler
);

export default router;
