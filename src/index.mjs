import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import mongoose from 'mongoose';

import homeRoutes from './routes/home.mjs';
import cartRoutes from './routes/cart.mjs';
import authRoutes from './routes/auth.mjs';
import usersRoutes from './routes/users.mjs';
import './strategies/local-strategy.mjs';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Session
app.use(
  session({
    secret: 'RestAppSecret',
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
  })
);

// Passport authentication
app.use(passport.initialize()); // initializes passport for incoming requests
app.use(passport.session()); // attach session.user to request

// Routes
app.use(homeRoutes);
app.use('/auth', authRoutes);
app.use('/cart', cartRoutes);
app.use('/users', usersRoutes);

/**
 * Passport authentication strategy options:
 *  - local   => email, password
 *  - google
 *  - facebook
 *  - github
 * The passport.authenticate('local') will call the local-strategy.mjs verify function.
 */
app.post('/pass', passport.authenticate('local'), (req, res) => {
  res.sendStatus(200);
});

app.get('/pass/status', (req, res) => {
  console.log('In /pass/status endpoint');
  console.log('Request user: ', req.user);
  console.log('Request session: ', req.session);
  return req.user ? res.send(req.user) : res.sendStatus(401);
});

app.post('/pass/logout', (req, res) => {
  if (!req.user) return res.sendStatus(401);

  req.logout(err => {
    if (err) return res.sendStatus(400);
    res.status(200).send({ message: 'Logged out' });
  });
});

app.use((req, res) => {
  res.status(404).send({ message: 'Page not found' });
});

const initializeApp = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/restBasicsDb');
    console.log('Connected to Database');
    app.listen(PORT, () => {
      console.log(`Running on port ${PORT}`);
    });
  } catch (err) {
    console.log('App initialization failed: ', err);
  }
};

initializeApp();
