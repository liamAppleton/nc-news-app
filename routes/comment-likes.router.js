const { getCommentLike, postCommentLike } = require('../controllers');

const commentLikesRouter = require('express').Router();

commentLikesRouter
  .route('/:username/:comment_id')
  .get(getCommentLike)
  .post(postCommentLike);

module.exports = commentLikesRouter;
