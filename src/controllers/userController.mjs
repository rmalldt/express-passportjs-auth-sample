import { response } from 'express';
import User from '../models/User.mjs';

export const postCreateUser = async (req, res) => {
  const { body } = req;

  const newUser = new User({
    email: body.email,
    password: body.password,
    fullName: body.fullName,
  });

  try {
    const savedUser = await newUser.save();
    console.log('New user saved: ', savedUser);
    res.status(201).send(savedUser);
  } catch (err) {
    return response.sendStatus(400);
  }
};
