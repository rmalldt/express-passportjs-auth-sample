import passport from 'passport';
import User from '../models/User.mjs';
import GoogleUser from '../models/GoogleUser.mjs';

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
export const passportSerialize = passport.serializeUser((user, done) => {
  console.log('Serialize user: ', user);
  done(null, user.id);
});

/**
 * Deserialize the verified object i.e. retrieve the user from session
 * via id and store the user into the request object.
 */
export const passportDeserialize = passport.deserializeUser(
  async (id, done) => {
    console.log('Deserialize user, id: ', id);
    let currentUser;
    // Check local user
    try {
      currentUser = await User.findById(id);
    } catch (err) {
      done(err, null);
    }

    // Check Google user
    try {
      if (!currentUser) {
        currentUser = await GoogleUser.findById(id);
        if (!currentUser) throw new Error('User Not Found');
        return done(null, currentUser);
      }
      done(null, currentUser);
    } catch (err) {
      done(err, null);
    }
  }
);
