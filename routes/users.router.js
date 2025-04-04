const usersRouter = require('express').Router();
const {
  getUsers,
  getUserByUsername,
  getCommentLike,
  postCommentLike,
} = require('../controllers');

usersRouter.route('/').get(getUsers);

usersRouter.route('/:username').get(getUserByUsername);

usersRouter
  .route('/:username/:comment_id')
  .get(getCommentLike)
  .post(postCommentLike);

module.exports = usersRouter;
