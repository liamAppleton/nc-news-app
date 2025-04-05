const { fetchArticleLikes, updateArticleLike } = require('../models');

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

module.exports = { getArticleLikes, putArticleLike };
