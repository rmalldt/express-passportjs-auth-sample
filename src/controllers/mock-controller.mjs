import { mockUsers } from '../utils/constants.mjs';

export const postLogin = (req, res) => {
  const {
    body: { email, password },
  } = req;

  const user = mockUsers.find(user => user.email === email);
  if (!user || user.password !== password) {
    return res.status(401).send({ message: 'BAD CREDENTIALS' });
  }

  req.session.user = user; // attach user to the session
  res.status(201).send(user);
};

export const getStatus = (req, res) => {
  return req.session.user
    ? res.status(200).send(req.session)
    : res.status(401).send({ message: 'NOT AUTHENTICATED' });
};

export const postLogout = (req, res) => {
  req.session.destroy(err => {
    console.log('Session destroyed: ', err);
  });
  res.status(200).send({ message: 'User logged out' });
};
