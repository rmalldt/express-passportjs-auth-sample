import passport from 'passport';
import { Strategy } from 'passport-local';
import { mockUsers } from '../utils/constants.mjs';

// Verify function
export default passport.use(
  new Strategy({ usernameField: 'email' }, (email, password, done) => {
    console.log(`Verifying email: ${email}, password: ${password}`);
    try {
      const findUser = mockUsers.find(user => user.email === email);
      if (!findUser) {
        throw new Error('User not found');
      }
      if (findUser.password !== password) {
        throw new Error('Invalid Credentials');
      }
      done(null, findUser);
    } catch (err) {
      done(err, null); // passport handles the error
    }
  })
);

// Serialize verified user object to store into the session.
// This function is called when User logs in.
// For the subsequent requests, once User is logged-in
//  |
//  V
// passport.deserializeUser() is called.
passport.serializeUser((user, done) => {
  console.log('Serialize user: ', user);
  done(null, user.id);
});

// Deserialize the verified object i.e. retrieve the user from session
// via id and store the user into the request object.
passport.deserializeUser((id, done) => {
  console.log('Deserialize user, id: ', id);
  try {
    const findUser = mockUsers.find(user => user.id === id);
    if (!findUser) {
      throw new Error('User Not Found');
    }
    done(null, findUser);
  } catch (err) {
    done(err, null);
  }
});
