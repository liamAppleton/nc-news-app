const { fetchTopics } = require('../models');

const getTopics = (req, res) => {
  const { query } = req;
  fetchTopics(query).then((topics) => {
    res.status(200).send({ topics: topics });
  });
};

module.exports = { getTopics };
