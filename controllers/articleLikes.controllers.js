const {
  fetchArticleLikes,
  updateArticleLike,
  removeArticleLike,
} = require('../models');

const getArticleLikes = (req, res, next) => {
  fetchArticleLikes()
    .then((articleLikes) => {
      res.status(200).send({ articleLikes });
    })
    .catch((err) => next(err));
};

const putArticleLike = (req, res, next) => {
  const { username, article_id, liked } = req.body;
  updateArticleLike(username, article_id, liked)
    .then((articleLike) => {
      res.status(200).send({ articleLike });
    })
    .catch((err) => next(err));
};

const deleteArticleLike = (req, res, next) => {
  const { username, article_id } = req.params;
  removeArticleLike(username, article_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => next(err));
};

module.exports = { getArticleLikes, putArticleLike, deleteArticleLike };
