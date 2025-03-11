export const getCart = (req, res) => {
  if (!req.session.user) return res.sendStatus(401);

  res.send(req.session.cart ?? []);
};

export const postCart = (req, res) => {
  if (!req.session.user) {
    return res.status(401).send({ message: 'NOT AUTHENTICATED' });
  }

  const item = req.body.item;

  const { cart } = req.session;
  if (cart) {
    cart.push(item);
  } else {
    req.session.cart = [item];
  }

  res.status(201).send(item);
};
