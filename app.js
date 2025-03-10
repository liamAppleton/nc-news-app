const express = require('express');
const app = express();
const { getEndpoints, getTopics } = require('./controllers');
const {
  handlePsqlError,
  handleServerError,
} = require('./error-handlers/error-handlers.controllers');

app.get('/api', getEndpoints);

app.get('/api/topics', getTopics);

app.use(handlePsqlError);

app.use(handleServerError);

module.exports = app;
