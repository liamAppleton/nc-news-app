const {
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
} = require('../models');

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticles = (req, res, next) => {
  fetchArticles().then((articles) => {
    res.status(200).send({ articles: articles });
  });
};

const getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  fetchCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments, comments });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getArticleById, getArticles, getCommentsByArticleId };
