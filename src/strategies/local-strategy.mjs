import passport from 'passport';
import bcrypt from 'bcrypt';
import { Strategy } from 'passport-local';

import User from '../models/User.mjs';
import { comparePassword } from '../utils/authUtil.mjs';

// Verify function
const localStrategy = passport.use(
  new Strategy({ usernameField: 'email' }, async (email, password, done) => {
    console.log(`Verifying email: ${email}, password: ${password}`);
    try {
      const currentUser = await User.findOne({ email: email });
      if (!currentUser) throw new Error('User not found');

      const doMatch = await comparePassword(password, currentUser.password);
      if (!doMatch) throw new Error('Bad Credentials');

      done(null, currentUser);
    } catch (err) {
      done(err, null); // passport handles the error
    }
  })
);

export default localStrategy;

/**
 * Serialize verified user object to store into the session.
 *
 * NOTE: This is a point where the session is modified, hence
 *       a new session is created for the logged-in user which
 *       is then stored into DB by mongo-connect.
 *
 * This function is called when User logs in successfully.
 * For the subsequent requests, once User is logged-in
 *                  |
 *                  V
 * passport.deserializeUser() is called.
 */
passport.serializeUser((user, done) => {
  console.log('Serialize user: ', user);
  done(null, user._id);
});

/**
 * Deserialize the verified object i.e. retrieve the user from session
 * via id and store the user into the request object.
 */
passport.deserializeUser(async (id, done) => {
  console.log('Deserialize user, id: ', id);
  try {
    const currentUser = await User.findById(id);

    if (!currentUser) throw new Error('User Not Found');
    done(null, currentUser);
  } catch (err) {
    done(err, null);
  }
});
