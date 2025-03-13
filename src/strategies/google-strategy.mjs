import 'dotenv/config';
import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';
import GoogleUser from '../models/google-user.mjs';

const googleStrategy = passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL, // URL is called upon successful user auth by Google
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log('Verifying google profile: ', profile);

      let currentUser;
      try {
        currentUser = await GoogleUser.findOne({ googleId: profile.id });
      } catch (err) {
        return done(err, null);
      }

      try {
        if (!currentUser) {
          const newUser = new GoogleUser({
            googleId: profile.id,
            email: profile.emails[0].value,
            displayName: profile.displayName,
          });
          const newSavedUser = await newUser.save();
          return done(null, newSavedUser);
        }
        done(null, currentUser);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

export default googleStrategy;
