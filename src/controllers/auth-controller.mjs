import User from '../models/user.mjs';
import { matchedData, validationResult } from 'express-validator';
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
    return next(newError('Invalid Input', 422, result.errors));
  }

  // Check if email already exists
  const { email, password, displayName } = req.body;
  try {
    const currentUser = await User.findOne({ email: email });
    if (currentUser)
      return res.status(400).send({ message: 'Email already exists' });
  } catch (error) {
    return res.sendStatus(500);
  }

  // Save user
  try {
    const hashedPass = await hashPassword(password);
    const newUser = new User({
      email: email,
      password: hashedPass,
      displayName: displayName,
    });
    const savedUser = await newUser.save();
    res.status(201).send({ message: 'Signup Success!', user: savedUser });
  } catch (err) {
    return response.sendStatus(500);
  }
};

export const postLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // Check email
    const user = await User.findOne({ email });
    if (!user) throw newError(`No user found associated with ${email}`, 400);

    // Check password
    const doMatch = await comparePassword(password, user.password);
    if (!doMatch) throw newError('Wrong password', 401);

    const jwt = issueJwt(user);
    res
      .status(200)
      .json({ user: user, token: jwt.token, expiresIn: jwt.expiresIn });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

export const getStatus = (req, res) => {
  console.log('In /auth/status endpoint');
  console.log('Request user: ', req.user);
  // console.log('Request session: ', req.session);
  return req.user ? res.send(req.user) : res.sendStatus(401);
};

export const postLogout = (req, res) => {
  console.log('SESSION: ', req.session.passport);
  if (!req.session.passport) return res.sendStatus(401);

  req.session.destroy(err => {
    console.log('Removed session: ', err);
    res.status(200).send({ message: 'Logged out successfully!' });
  });
};

export const getGoogleCallbackHandler = (req, res) => {
  console.log('In /auth/google/callback endpoint');
  console.log('Request user: ', req.user);
  console.log('Request session: ', req.session);
  res.sendStatus(200);
};
