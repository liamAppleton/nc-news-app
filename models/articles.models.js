const db = require('../db/connection.js');

const fetchArticleById = (articleId) => {
  return db
    .query('SELECT * FROM articles WHERE article_id = $1', [articleId])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'article not found' });
      }
      return rows[0];
    });
};

const fetchArticles = () => {
  return db
    .query(
      `SELECT articles.article_id, articles.title, articles.topic, articles.created_at,
       articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count 
       FROM articles LEFT JOIN comments 
       ON articles.article_id = comments.article_id 
       GROUP BY articles.article_id, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url 
       ORDER BY articles.created_at DESC`
    )
    .then(({ rows }) => {
      return rows;
    });
};

const fetchCommentsByArticleId = (articleId) => {
  return db
    .query(
      `SELECT comment_id, article_id, body, votes, author, created_at
    FROM comments WHERE article_id = $1
    ORDER BY created_at DESC`,
      [articleId]
    )
    .then(({ rows }) => {
      return rows;
    });
};

module.exports = { fetchArticleById, fetchArticles, fetchCommentsByArticleId };
