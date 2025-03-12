const express = require('express');
const app = express();
const {
  handleNotARouteError,
  handlePsqlError,
  handleCustomError,
  handleServerError,
} = require('./error-handlers/error-handlers.controllers');
const apiRouter = require('./routes/api-router.js');

app.use(express.json());

app.use('/api', apiRouter);

app.all('*', handleNotARouteError);

app.use(handlePsqlError);

app.use(handleCustomError);

app.use(handleServerError);

module.exports = app;
