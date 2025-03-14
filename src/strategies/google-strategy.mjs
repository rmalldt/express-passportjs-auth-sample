import 'dotenv/config';
import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';
import GoogleUser from '../models/google-user.mjs';

const googleOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
};

export default passport.use(
  new Strategy(
    googleOptions,
    async (accessToken, refreshToken, profile, done) => {
      console.log('Verifying google profile: ', profile);
      try {
        let user = await GoogleUser.findOne({ googleId: profile.id });

        if (!user) {
          user = new GoogleUser({
            googleId: profile.id,
            email: profile.emails[0].value,
            displayName: profile.displayName,
          });
        }

        const newUser = await user.save();
        done(null, newUser);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

// export const serialize = passport.serializeUser((user, done) => {
//   console.log('Serialize user: ', user);
//   done(null, user.id);
// });

// export const deserialize = passport.deserializeUser(async (id, done) => {
//   console.log('Deserialize user: ', id);
//   try {
//     const user = await GoogleUser.findById(id);
//     done(null, user);
//   } catch (err) {
//     done(err, false);
//   }
// });
