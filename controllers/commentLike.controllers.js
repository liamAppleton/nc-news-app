const { fetchCommentLike } = require('../models');

const getCommentLike = (req, res, next) => {
  const { username, comment_id } = req.params;
  fetchCommentLike(username, comment_id)
    .then((commentLike) => {
      res.status(200).send({ commentLike });
    })
    .catch((err) => next(err));
};

module.exports = { getCommentLike };
