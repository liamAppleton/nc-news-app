const {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleById,
} = require('../controllers');

const articlesRouter = require('express').Router();

articlesRouter.route('/').get(getArticles);
articlesRouter.route('/:article_id').get(getArticleById);
articlesRouter.route('/:article_id/comments').get(getCommentsByArticleId);
articlesRouter.route('/:article_id/comments').post(postCommentByArticleId);
articlesRouter.route('/:article_id').patch(patchArticleById);

module.exports = articlesRouter;
