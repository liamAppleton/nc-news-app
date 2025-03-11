const { fetchTopics } = require('../models');

const getTopics = (req, res, next) => {
  const { query } = req;
  fetchTopics(query)
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => next(err));
};

module.exports = { getTopics };
