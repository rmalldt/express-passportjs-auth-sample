import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';

import homeRoutes from './routes/home.mjs';
import cartRoutes from './routes/cart.mjs';
import authRoutes from './routes/auth.mjs';
import googleStrategy from './strategies/google-strategy.mjs';

const PORT = process.env.PORT || 3000;

const app = express();

// Connect DB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to Database'))
  .catch(err => console.log('DB connection failed: ', err));

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Session
app.use(
  session({
    secret: process.env.SESSION_KEY,
    saveUninitialized: false,
    resave: false,
    cookie: {
      httpOnly: true,
      sameSite: 'Strict',
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
// app.use(passport.session()); // attach session.user to request

// Routes
app.use(homeRoutes);
app.use('/auth', authRoutes);
app.use('/cart', cartRoutes);

// Catch all
app.use((req, res) => {
  res.sendStatus(404);
});

// Error handling middleware
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  console.log('Error Middleware Code: ', statusCode);
  console.log('Error Middleware Message: ', message);
  console.log('Error Middleware Data: ', data);
  res.status(statusCode).json({ message, data });
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
