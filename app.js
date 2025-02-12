const express = require('express');
const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed');

const app = express();

// For parsing application/json (JSON data)
app.use(bodyParser.json());

// For parsing application/x-www-form-urlencoded <form> (text data)
app.use(bodyParser.urlencoded({ extended: false }));

// Configure CORS
app.use((req, res, next) => {
  // Allow all domains to access our server.
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Allow allowed domains/origins/clients to use specific methods.
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );

  // Allow origins to send requests that contains extra authorization header.
  // NOTE: There are already some default headers which are always allowed.
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/feed', feedRoutes);

app.listen(8080);
