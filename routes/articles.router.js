const {
  getArticles,
  postArticle,
  getArticleById,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleById,
  deleteArticle,
} = require('../controllers');

const articlesRouter = require('express').Router();

articlesRouter.route('/').get(getArticles).post(postArticle);

articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchArticleById)
  .delete(deleteArticle);

articlesRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

module.exports = articlesRouter;
