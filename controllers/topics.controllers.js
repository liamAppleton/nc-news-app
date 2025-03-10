const { fetchTopics } = require('../models');

const getTopics = (req, res) => {
  fetchTopics().then((topics) => {
    res.status(200).send({ topics: topics });
  });
};

module.exports = { getTopics };
