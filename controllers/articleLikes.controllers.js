const { fetchArticleLikes } = require('../models');

const getArticleLikes = (req, res, next) => {
  fetchArticleLikes()
    .then((articleLikes) => {
      res.status(200).send({ articleLikes });
    })
    .catch((err) => next(err));
};

module.exports = { getArticleLikes };
