const apiRouter = require('express').Router();
const topicsRouter = require('./topics.router');

apiRouter.use('/topics', topicsRouter);

apiRouter.get('/', (req, res) => {
  res.send('Hello World');
});

module.exports = apiRouter;
