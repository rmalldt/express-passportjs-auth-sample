import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';

import homeRoutes from './routes/home.mjs';
import cartRoutes from './routes/cart.mjs';
import mockRoutes from './routes/mock.mjs';
import authRoutes from './routes/auth.mjs';
import localStrategy from './strategies/local-strategy.mjs';
import googleStrategy from './strategies/google-strategy.mjs';

const PORT = process.env.PORT || 3000;

const app = express();

// Connect DB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to Database'))
  .catch(err => console.log('DB connection failed: ', err));

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
    secret: process.env.SESSION_KEY,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
    /**
     * - Creates 'session' collection in DB.
     * - Stores session of loggedin user in session collection referencing session id.
     * - Retrieves the session from DB via session id and attaches to the incoming request
     *   providing 'request.session'.
     */
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })
);

// Passport authentication
app.use(passport.initialize()); // initializes passport for incoming requests
app.use(passport.session()); // attach session.user to request
localStrategy;
googleStrategy;

// Routes
app.use(homeRoutes);
app.use('/mock', mockRoutes);
app.use('/auth', authRoutes);
app.use('/cart', cartRoutes);

// Catch all
app.use((req, res) => {
  res.status(404).send({ message: 'Page not found' });
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
