const {
  getCommentLike,
  postCommentLike,
  putCommentLike,
  deleteCommentLike,
} = require('../controllers');

const commentLikesRouter = require('express').Router();

commentLikesRouter.route('/').post(postCommentLike);

commentLikesRouter
  .route('/:username/:comment_id')
  .get(getCommentLike)
  .put(putCommentLike)
  .delete(deleteCommentLike);

module.exports = commentLikesRouter;
