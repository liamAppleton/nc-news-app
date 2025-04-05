const getEndpoints = require('./endpoints.controller');
const { getTopics, postTopic } = require('./topics.controllers');
const {
  getArticleById,
  getArticles,
  postArticle,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleById,
  deleteArticle,
} = require('./articles.controllers');
const { patchCommentById, deleteComment } = require('./comments.controllers');
const { getUsers, getUserByUsername } = require('./users.controllers');
const {
  getCommentLikes,
  putCommentLike,
  deleteCommentLike,
} = require('./commentLike.controllers');

module.exports = {
  getEndpoints,
  getTopics,
  postTopic,
  getArticleById,
  getArticles,
  postArticle,
  getCommentsByArticleId,
  postCommentByArticleId,
  patchArticleById,
  deleteArticle,
  patchCommentById,
  deleteComment,
  getUsers,
  getUserByUsername,
  getCommentLikes,
  putCommentLike,
  deleteCommentLike,
};
