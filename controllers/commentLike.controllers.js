const {
  fetchCommentLike,
  addCommentLike,
  updateCommentLike,
  removeCommentLike,
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

const putCommentLike = (req, res, next) => {
  const { liked } = req.body;
  const { username, comment_id } = req.params;
  updateCommentLike(username, comment_id, liked)
    .then((commentLike) => {
      res.status(200).send({ commentLike });
    })
    .catch((err) => next(err));
};

const deleteCommentLike = (req, res, next) => {
  const { username, comment_id } = req.params;
  removeCommentLike(username, comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => next(err));
};

module.exports = {
  getCommentLike,
  postCommentLike,
  putCommentLike,
  deleteCommentLike,
};
