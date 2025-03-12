import passport from 'passport';
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
