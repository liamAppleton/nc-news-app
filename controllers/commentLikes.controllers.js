const {
  fetchCommentLikes,
  updateCommentLike,
  removeCommentLike,
} = require('../models');

const getCommentLikes = (req, res, next) => {
  fetchCommentLikes()
    .then((commentLikes) => {
      res.status(200).send({ commentLikes });
    })
    .catch((err) => next(err));
};

const putCommentLike = (req, res, next) => {
  const { username, comment_id, liked } = req.body;
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
  getCommentLikes,
  putCommentLike,
  deleteCommentLike,
};
