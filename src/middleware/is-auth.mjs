import GoogleUser from '../models/google-user.mjs';
import User from '../models/user.mjs';
import { verifyJwt } from '../utils/auth-util.mjs';
import { newError } from '../utils/error-util.mjs';

export const isAuth = async (req, res, next) => {
  const token = req.get('Authorization')?.split(' ')[1];
  if (!token) {
    return next(newError(400, 'Bad Request'));
  }

  try {
    const decoded = verifyJwt(token);
    if (!decoded) {
      return next(newError(401, 'Not Authorized'));
    }

    // Get user from DB and attach user to incoming request
    let user = await User.findById(decoded.sub);
    if (!user) {
      user = await GoogleUser.findById(decoded.sub);
      if (!user) {
        return next(newError(401, 'No user found'));
      }
    }
    req.user = user;
    next();
  } catch (err) {
    next(newError(500, 'internal', err));
  }
};
