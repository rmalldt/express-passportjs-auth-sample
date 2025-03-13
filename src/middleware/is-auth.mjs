import { newError } from '../utils/error-util.mjs';

export const isAuth = (req, res, next) => {
  if (!req.user || !req.session.passport) {
    throw newError('Not authenticated', 401);
  }

  const userId = req.user._id.toString();
  const sessionUserId = req.session.passport.user;

  if (userId !== sessionUserId) {
    throw newError('Not authenticated', 401);
  }
  next();
};
