const express = require('express');
const app = express();
const { getEndpoints, getTopics, getArticleById } = require('./controllers');
const {
  handlePsqlError,
  handleCustomError,
  handleServerError,
} = require('./error-handlers/error-handlers.controllers');

app.get('/api', getEndpoints);

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleById);

app.use(handlePsqlError);

app.use(handleCustomError);

app.use(handleServerError);

module.exports = app;
