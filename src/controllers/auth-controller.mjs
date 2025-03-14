import User from '../models/user.mjs';
import { validationResult } from 'express-validator';
import {
  comparePassword,
  hashPassword,
  issueJwt,
} from '../utils/auth-util.mjs';
import { newError } from '../utils/error-util.mjs';

export const postSignup = async (req, res, next) => {
  // Validate inputs
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.errors.map(error => error.msg);
    return next(newError(422, 'Invalid Input', errors));
  }

  const { email, password, displayName } = req.body;
  try {
    // Check if email already exists
    const currentUser = await User.findOne({ email: email });
    if (currentUser) {
      return next(newError(400, 'Email already exists'));
    }

    // Save user
    const hashedPass = await hashPassword(password);
    const newUser = new User({
      email: email,
      password: hashedPass,
      displayName: displayName,
    });
    const savedUser = await newUser.save();

    res.status(201).send({
      message: 'Signup Success',
      user: {
        id: savedUser._id,
        email: savedUser.email,
        displayName: savedUser.displayName,
      },
    });
  } catch (err) {
    next(newError(500, 'internal', err));
  }
};

export const postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // Check email
    const user = await User.findOne({ email });
    if (!user) {
      return next(newError(400, 'User Not Found.'));
    }

    // Check password
    const doMatch = await comparePassword(password, user.password);
    if (!doMatch) {
      return next(newError(400, 'Bad Request'));
    }

    // Issue token
    const jwt = issueJwt(user);
    req.session.visited = true; // attach session and store in DB
    res.status(200).json({
      message: 'Login Success',
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
      },
      token: jwt.token,
      expiresIn: jwt.expiresIn,
    });
  } catch (err) {
    next(newError(500, 'internal', err));
  }
};

export const getStatus = (req, res) => {
  console.log('In /auth/status endpoint');
  console.log('Request user: ', req.user);
  console.log('Request session: ', req.session);
  res.status(200).json({
    message: 'Access granted!',
    user: {
      id: req.user._id,
      email: req.user.email,
      displayName: req.user.displayName,
    },
    session: req.session,
  });
};

export const postLogout = (req, res) => {
  console.log('In /auth/logout: ');
  if (!req.user) return res.sendStatus(401);

  req.session.destroy(err => {
    console.log('Removed session');
  });
  delete req.user;

  res
    .status(200)
    .send({ message: 'Logout Success, remove token from frontend.' });
};

export const getGoogleCallbackHandler = (req, res) => {
  console.log('In /auth/google/callback');

  // Issue jwt token for google user
  // NOTE: Passport Google strategy attaches user to incoming request.
  const jwt = issueJwt(req.user);
  req.session.visited = true; // attach session and store in DB
  res.status(200).json({
    message: 'Login Success',
    user: {
      id: req.user._id,
      email: req.user.email,
      displayName: req.user.displayName,
    },
    token: jwt.token,
    expiresIn: jwt.expiresIn,
  });
};
