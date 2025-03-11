import express from 'express';
import passport from 'passport';
import { checkSchema } from 'express-validator';

import { userValidationSchema } from '../utils/validationSchemas.mjs';
import {
  postSignup,
  postLogin,
  getStatus,
  postLogout,
  getGoogleCallbackHandler,
} from '../controllers/authController.mjs';

const router = express.Router();

router.post('/signup', checkSchema(userValidationSchema), postSignup);

/**
 * Local strategy:
 *  - local => email, password
 *  - The passport.authenticate('local') will call the local-strategy.mjs verify function
 *    which is imported in index.mjs.
 */
router.post('/login', passport.authenticate('local'), postLogin);
router.get('/status', getStatus);
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
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));
router.get(
  '/google/callback',
  passport.authenticate('google'),
  getGoogleCallbackHandler
);

export default router;
