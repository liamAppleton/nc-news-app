const { fetchTopics, addTopic } = require('./topics.models');
const {
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
  addCommentByArticleId,
  updateArticleById,
  addArticle,
  removeArticle,
} = require('./articles.models');
const { updateCommentById, removeComment } = require('./comments.models');
const { fetchUsers, fetchUserByUsername } = require('./users.models');
const { fetchCommentLike } = require('./commentLike.models');

module.exports = {
  fetchTopics,
  addTopic,
  fetchArticleById,
  fetchArticles,
  addArticle,
  fetchCommentsByArticleId,
  addCommentByArticleId,
  updateArticleById,
  removeArticle,
  updateCommentById,
  removeComment,
  fetchUsers,
  fetchUserByUsername,
  fetchCommentLike,
};
