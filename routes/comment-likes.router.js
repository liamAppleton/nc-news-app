const {
  getCommentLike,
  putCommentLike,
  deleteCommentLike,
} = require('../controllers');

const commentLikesRouter = require('express').Router();

commentLikesRouter
  .route('/:username/:comment_id')
  .get(getCommentLike)
  .put(putCommentLike)
  .delete(deleteCommentLike);

module.exports = commentLikesRouter;
