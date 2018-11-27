const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const user = require('./api/routes/user');

app.use(express.json());

app.options('*', cors());

app.use('/user', user);

app.use((req, res, next) => {
  const error = new Error('Route not available.');
  error.status = 404;
  next(error);
});

app.use((error, req, res) => {
  res.status(error.status || 500);
  res.json({ error: { message: error.message } });
});

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

const port = process.env.PORT || 8080;

app.listen(port);
