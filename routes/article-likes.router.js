const {
  getArticleLikes,
  putArticleLike,
  deleteArticleLike,
} = require('../controllers');

const articleLikesRouter = require('express').Router();

articleLikesRouter.route('/').get(getArticleLikes).put(putArticleLike);

articleLikesRouter.route('/:username/:article_id').delete(deleteArticleLike);

module.exports = articleLikesRouter;
