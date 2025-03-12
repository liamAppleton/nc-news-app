const getEndpoints = require('./endpoints.controller');
const { getTopics } = require('./topics.controllers');
const {
  getArticleById,
  getArticles,
  postArticle,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleById,
} = require('./articles.controllers');
const { patchCommentById, deleteComment } = require('./comments.controllers');
const { getUsers, getUserByUsername } = require('./users.controllers');

module.exports = {
  getEndpoints,
  getTopics,
  getArticleById,
  getArticles,
  postArticle,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleById,
  patchCommentById,
  deleteComment,
  getUsers,
  getUserByUsername,
};
