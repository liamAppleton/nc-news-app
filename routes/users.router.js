const userRouter = require('express').Router();
const { getUsers } = require('../controllers');

userRouter.route('/').get(getUsers);

module.exports = userRouter;
