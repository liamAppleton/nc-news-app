const { getArticleLikes } = require('../controllers');

const articleLikesRouter = require('express').Router();

articleLikesRouter.route('/').get(getArticleLikes);

module.exports = articleLikesRouter;
