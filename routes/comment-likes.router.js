const {
  getCommentLikes,
  putCommentLike,
  deleteCommentLike,
} = require('../controllers');

const commentLikesRouter = require('express').Router();

commentLikesRouter.route('/').get(getCommentLikes);

commentLikesRouter
  .route('/:username/:comment_id')
  .put(putCommentLike)
  .delete(deleteCommentLike);

module.exports = commentLikesRouter;
