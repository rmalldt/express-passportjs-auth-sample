export const getCart = (req, res) => {
  res.send(req.session.cart || []);
};

export const postCart = (req, res) => {
  const item = req.body.item;
  const cart = req.session.cart;
  if (cart) {
    cart.push(item);
  } else {
    req.session.cart = [item];
  }

  res.status(201).send(item);
};
