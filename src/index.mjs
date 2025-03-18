import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import session from 'express-session';
import passport from 'passport';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';

import homeRoutes from './routes/home.mjs';
import cartRoutes from './routes/cart.mjs';
import authRoutes from './routes/auth.mjs';
import './strategies/google-strategy.mjs';
import { newError } from './utils/error-util.mjs';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(helmet());

// Connect DB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to Database'))
  .catch(err => console.log('DB connection failed: ', err));

// Store
const store = MongoStore.create({
  client: mongoose.connection.getClient(),
});

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
    store: store,
    cookie: {
      httpOnly: true,
      sameSite: 'Strict',
      maxAge: 1000 * 60 * 60,
    },
  })
);

// Passport authentication
app.use(passport.initialize()); // initializes passport for incoming requests
app.use(passport.session());

// Routes
app.use(homeRoutes);
app.use('/auth', authRoutes);
app.use('/cart', cartRoutes);

// Catch 404/all and forward to error handler
app.use((req, res, next) => {
  const err = newError(404, 'Not Found');
  res.sendStatus(404);
});

// Error handler
app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  console.log('Error Handler: ', error);
  res.status(statusCode).json({ message, data });
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
