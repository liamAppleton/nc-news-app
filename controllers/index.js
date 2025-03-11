const getEndpoints = require('./endpoints.controller');
const { getTopics } = require('./topics.controllers');
const {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
} = require('./articles.controllers');

module.exports = {
  getEndpoints,
  getTopics,
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
};
