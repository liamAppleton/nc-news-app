const usersRouter = require('express').Router();
const {
  getUsers,
  getUserByUsername,
  getCommentLike,
} = require('../controllers');

usersRouter.route('/').get(getUsers);

usersRouter.route('/:username').get(getUserByUsername);

usersRouter.route('/:username/:comment_id').get(getCommentLike);

module.exports = usersRouter;
