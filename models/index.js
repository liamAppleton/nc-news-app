const { fetchTopics } = require('./topics.models');
const {
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
  addCommentByArticleId,
  updateArticleById,
} = require('./articles.models');
const { updateCommentById, removeComment } = require('./comments.models');
const { fetchUsers, fetchUserByUsername } = require('./users.models');

module.exports = {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
  addCommentByArticleId,
  updateArticleById,
  updateCommentById,
  removeComment,
  fetchUsers,
  fetchUserByUsername,
};
