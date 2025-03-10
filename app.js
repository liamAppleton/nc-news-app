const express = require('express');
const app = express();
const {
  getEndpoints,
  getTopics,
  getArticleById,
  getArticles,
  getCommentsByArticleId,
} = require('./controllers');
const {
  handleNotARouteError,
  handlePsqlError,
  handleCustomError,
  handleServerError,
} = require('./error-handlers/error-handlers.controllers');

app.get('/api', getEndpoints);

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.all('*', handleNotARouteError);

app.use(handlePsqlError);

app.use(handleCustomError);

app.use(handleServerError);

module.exports = app;
