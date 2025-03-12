const getEndpoints = require('./endpoints.controller');
const { getTopics } = require('./topics.controllers');
const {
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleById,
} = require('./articles.controllers');
const { deleteComment } = require('./comments.controllers');
const { getUsers, getUserByUsername } = require('./users.controllers');

module.exports = {
  getEndpoints,
  getTopics,
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleById,
  deleteComment,
  getUsers,
  getUserByUsername,
};
