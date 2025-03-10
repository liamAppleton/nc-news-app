const getEndpoints = require('./endpoints.controller');
const { getTopics } = require('./topics.controllers');
const { getArticleById } = require('./articles.controllers');

module.exports = { getEndpoints, getTopics, getArticleById };
