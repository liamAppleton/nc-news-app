const express = require('express');
const app = express();
const {
  getEndpoints,
  getTopics,
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleById,
  deleteComment,
  getUsers,
} = require('./controllers');
const {
  handleNotARouteError,
  handlePsqlError,
  handleCustomError,
  handleServerError,
} = require('./error-handlers/error-handlers.controllers');
const apiRouter = require('./routes/api-router.js');

app.use(express.json());

app.use('/api', apiRouter);

app.get('/api', getEndpoints);

app.delete('/api/comments/:comment_id', deleteComment);

app.all('*', handleNotARouteError);

app.use(handlePsqlError);

app.use(handleCustomError);

app.use(handleServerError);

module.exports = app;
