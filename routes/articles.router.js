const {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleById,
} = require('../controllers');

const articlesRouter = require('express').Router();

articlesRouter.route('/').get(getArticles);

articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchArticleById);

articlesRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

module.exports = articlesRouter;
