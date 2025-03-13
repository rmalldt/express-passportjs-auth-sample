export const getHome = (req, res) => {
  console.log('SESSION ID: ', req.session.id);
  console.log('SESSION: ', req.session);
  req.session.visited = true;
  res.status(200).send({ message: 'Home Page' });
};
