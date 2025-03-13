const {
  fetchArticleById,
  fetchArticles,
  addArticle,
  fetchCommentsByArticleId,
  addCommentByArticleId,
  updateArticleById,
  removeArticle,
} = require('../models');

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticles = (req, res, next) => {
  const { query } = req;
  fetchArticles(query)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

const postArticle = (req, res, next) => {
  const { author, title, body, topic, article_img_url } = req.body;
  addArticle({ author, title, body, topic, article_img_url })
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

const getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { query } = req;
  fetchCommentsByArticleId({ query, article_id })
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

const postCommentByArticleId = (req, res, next) => {
  const { username, body } = req.body;
  const { article_id } = req.params;
  addCommentByArticleId({ username, body, article_id })
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

const patchArticleById = (req, res, next) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;
  updateArticleById({ inc_votes, article_id })
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

const deleteArticle = (req, res, next) => {
  const { article_id } = req.params;
  removeArticle(article_id).then(() => {
    res.status(204).send();
  });
};

module.exports = {
  getArticleById,
  getArticles,
  postArticle,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleById,
  deleteArticle,
};
