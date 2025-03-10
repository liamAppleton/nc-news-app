const express = require('express');
const app = express();
const endpoints = require('./endpoints.json');
const { getTopics } = require('./controllers');
const {
  handlePsqlError,
} = require('./error-handlers/error-handlers.controllers');

app.get('/api', (req, res) => {
  res.status(200).send({ endpoints: endpoints });
});

app.get('/api/topics', getTopics);

app.use(handlePsqlError);

module.exports = app;
