const db = require('../db/connection.js');
const format = require('pg-format');
const { checkExists } = require('../db/seeds/utils.js');

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
  const promises = [checkExists('articles', 'article_id', articleId)];

  const queryString = `SELECT comment_id, article_id, body, votes, author, created_at
    FROM comments WHERE article_id = $1
    ORDER BY created_at DESC`;

  promises.push(db.query(queryString, [articleId]));

  return Promise.all(promises).then(([_, { rows }]) => {
    return rows;
  });
};

const addCommentByArticleId = ({ username, body, article_id }) => {
  if (!body) {
    return Promise.reject({ status: 400, msg: 'bad request' });
  }

  const promises = [checkExists('articles', 'article_id', article_id)];
  promises.push(checkExists('users', 'username', username));

  const queryString = format(
    `INSERT INTO comments
  (author, body, article_id, created_at)
  VALUES %L RETURNING *`,
    [[username, body, article_id, new Date()]]
  );
  promises.push(db.query(queryString));

  return Promise.all(promises).then(
    ([checkArticlePromise, checkUserPromise, { rows }]) => {
      return rows[0];
    }
  );
};

const updateArticleById = ({ inc_votes, article_id }) => {
  const promises = [checkExists('articles', 'article_id', article_id)];

  const queryString = `UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *`;

  promises.push(db.query(queryString, [inc_votes, article_id]));

  return Promise.all(promises).then(([_, { rows }]) => {
    return rows[0];
  });
};

module.exports = {
  fetchArticleById,
  fetchArticles,
  fetchCommentsByArticleId,
  addCommentByArticleId,
  updateArticleById,
};
