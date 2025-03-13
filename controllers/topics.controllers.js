const { fetchTopics, addTopic } = require('../models');

const getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => next(err));
};

const postTopic = (req, res, next) => {
  const { slug, description } = req.body;
  addTopic({ slug, description }).then((topic) => {
    res.status(201).send({ topic });
  });
};

module.exports = { getTopics, postTopic };
