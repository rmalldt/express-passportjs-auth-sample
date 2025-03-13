import User from '../models/user.mjs';
import { matchedData, validationResult } from 'express-validator';
import { hashPassword } from '../utils/auth-util.mjs';
import { newError } from '../utils/error-util.mjs';

export const postSignup = async (req, res) => {
  // Validate inputs
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errorMessages = result.errors.map(err => err.msg);
    return res.status(422).send({ message: errorMessages });
  }

  // Check if email already exists
  const { body } = req;
  try {
    const currentUser = await User.findOne({ email: body.email });
    if (currentUser)
      return res.status(400).send({ message: 'Email already exists' });
  } catch (error) {
    return res.sendStatus(500);
  }

  // Save user
  try {
    const hashedPass = await hashPassword(body.password);
    const newUser = new User({
      email: body.email,
      password: hashedPass,
      displayName: body.displayName,
    });
    const savedUser = await newUser.save();
    console.log('New user saved: ', savedUser);
    res.status(201).send(savedUser);
  } catch (err) {
    return response.sendStatus(400);
  }
};

export const postLogin = async (req, res) => {
  res.status(200).send({ message: 'Login success!' });
};

export const getStatus = (req, res) => {
  console.log('In /auth/status endpoint');
  console.log('Request user: ', req.user);
  console.log('Request session: ', req.session);
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
