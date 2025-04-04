const {
  getCommentLike,
  postCommentLike,
  patchCommentLike,
  deleteCommentLike,
} = require('../controllers');

const commentLikesRouter = require('express').Router();

commentLikesRouter.route('/').post(postCommentLike);

commentLikesRouter
  .route('/:username/:comment_id')
  .get(getCommentLike)
  .patch(patchCommentLike)
  .delete(deleteCommentLike);

module.exports = commentLikesRouter;
