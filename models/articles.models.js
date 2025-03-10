const db = require('../db/connection.js');

const fetchArticleById = (articleId) => {
  return db
    .query('SELECT * FROM articles WHERE article_id = $1', [articleId])
    .then(({ rows }) => {
      return rows[0];
    });
};

module.exports = { fetchArticleById };
