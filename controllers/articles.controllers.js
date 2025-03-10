const { fetchArticleById } = require('../models');

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id).then((article) => {
    res.status(200).send({ article: article });
  });
};

module.exports = { getArticleById };
