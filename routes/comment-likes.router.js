const {
  getCommentLike,
  postCommentLike,
  patchCommentLike,
  deleteCommentLike,
} = require('../controllers');

const commentLikesRouter = require('express').Router();

commentLikesRouter
  .route('/:username/:comment_id')
  .get(getCommentLike)
  .post(postCommentLike)
  .patch(patchCommentLike)
  .delete(deleteCommentLike);

module.exports = commentLikesRouter;
