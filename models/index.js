const { fetchTopics } = require('./topics.models');
const {
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
  addCommentByArticleId,
  updateArticleById,
} = require('./articles.models');

module.exports = {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
  addCommentByArticleId,
  updateArticleById,
};
