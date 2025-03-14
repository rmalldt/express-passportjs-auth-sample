import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { fileURLToPath } from 'url';
import User from '../models/user.mjs';
import { newError } from '../utils/error-util.mjs';

const PUB_KEY = fs.readFileSync(
  path.join(
    fileURLToPath(import.meta.url),
    '..',
    '..',
    'cryptography',
    'id_rsa_pub.pem'
  ),
  'utf-8'
);

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ['RS256'],
};

const jwtStrategy = passport.use(
  new Strategy(options, async (payload, done) => {
    console.log('JWT payload:');
    try {
      const user = await User.findOne({ _id: payload.sub });
      if (!user) throw newError('User Not Found', 500);
      done(null, user);
    } catch (err) {
      done(err, false);
    }
  })
);

export default jwtStrategy;
