/**
 * The res.json() is an express method that allows to conveniently
 * return a response with JSON data with required headers set.
 */
exports.getPosts = (req, res, next) => {
  res.status(200).json({
    posts: [
      { title: 'First post', content: 'This is a first post' },
      { title: 'Second post', content: 'This is a second post' },
      { title: 'Third post', content: 'This is a third post' },
    ],
  });
};

exports.postPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  console.log(title, content);
  // Create post in db
  res.status(201).json({
    message: 'Post created successfully',
    post: { id: new Date().toISOString(), title: title, content: content },
  });
};
