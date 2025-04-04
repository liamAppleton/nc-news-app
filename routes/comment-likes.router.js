const {
  getCommentLike,
  postCommentLike,
  patchCommentLike,
} = require('../controllers');

const commentLikesRouter = require('express').Router();

commentLikesRouter
  .route('/:username/:comment_id')
  .get(getCommentLike)
  .post(postCommentLike)
  .patch(patchCommentLike);

module.exports = commentLikesRouter;
