const apiRouter = require('express').Router();
const articlesRouter = require('./articles.router');
const commentsRouter = require('./comments-router');
const endpointsRouter = require('./endpoints-router');
const topicsRouter = require('./topics.router');
const usersRouter = require('./users.router');

apiRouter.use('/', endpointsRouter);

apiRouter.use('/topics', topicsRouter);

apiRouter.use('/users', usersRouter);

apiRouter.use('/articles', articlesRouter);

apiRouter.use('/comments', commentsRouter);

module.exports = apiRouter;
