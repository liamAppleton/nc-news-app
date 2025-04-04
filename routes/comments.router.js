const { patchCommentById, deleteComment } = require('../controllers');

const commentsRouter = require('express').Router();

commentsRouter
  .route('/:comment_id')
  .patch(patchCommentById)
  .delete(deleteComment);

module.exports = commentsRouter;
