const {
  getCommentLikes,
  putCommentLike,
  deleteCommentLike,
} = require('../controllers');

const commentLikesRouter = require('express').Router();

commentLikesRouter.route('/').get(getCommentLikes).put(putCommentLike);

commentLikesRouter
  .route('/:username/:comment_id')

  .delete(deleteCommentLike);

module.exports = commentLikesRouter;
