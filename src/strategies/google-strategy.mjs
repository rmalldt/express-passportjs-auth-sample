import 'dotenv/config';
import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';
import GoogleUser from '../models/GoogleUser.mjs';

const googleStrategy = passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL, // URL is called upon successful user authorization
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log('Verifying google profile: ', profile);

      const currentUser = await GoogleUser.findOne({ googleId: profile.id });
      if (!currentUser) {
        const newUser = new GoogleUser({
          googleId: profile.id,
        });
      }

      done(null, profile);
    }
  )
);

export default googleStrategy;
