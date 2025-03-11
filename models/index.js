const { fetchTopics } = require('./topics.models');
const {
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
  addCommentByArticleId,
  updateArticleById,
} = require('./articles.models');
const { removeComment } = require('./comments.models');
module.exports = {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
  addCommentByArticleId,
  updateArticleById,
  removeComment,
};
