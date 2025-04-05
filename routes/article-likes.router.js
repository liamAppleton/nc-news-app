const { getArticleLikes, putArticleLike } = require('../controllers');

const articleLikesRouter = require('express').Router();

articleLikesRouter.route('/').get(getArticleLikes).put(putArticleLike);

module.exports = articleLikesRouter;
