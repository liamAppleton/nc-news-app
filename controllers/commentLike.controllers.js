const {
  fetchCommentLike,
  addCommentLike,
  updateCommentLike,
} = require('../models');

const getCommentLike = (req, res, next) => {
  const { username, comment_id } = req.params;
  fetchCommentLike(username, comment_id)
    .then((commentLike) => {
      res.status(200).send({ commentLike });
    })
    .catch((err) => next(err));
};

const postCommentLike = (req, res, next) => {
  const { body } = req;
  addCommentLike(body)
    .then((commentLike) => {
      res.status(201).send({ commentLike });
    })
    .catch((err) => next(err));
};

const patchCommentLike = (req, res, next) => {
  const { liked } = req.body;
  const { username, comment_id } = req.params;
  updateCommentLike({ username, comment_id, liked }).then((commentLike) => {
    res.status(200).send({ commentLike });
  });
};

module.exports = { getCommentLike, postCommentLike, patchCommentLike };
