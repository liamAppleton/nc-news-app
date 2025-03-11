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

const fetchArticles = (query) => {
  let queryString = `SELECT articles.article_id, articles.title, articles.topic, articles.created_at,
       articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count 
       FROM articles LEFT JOIN comments 
       ON articles.article_id = comments.article_id `;

  const groupBy = `GROUP BY articles.article_id, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url `;
  const queryFormatParams = [];
  const queryParams = [];

  if (query.topic) {
    queryString += `WHERE articles.topic = $1 `;
    queryParams.push(query.topic);
  }

  if (query['sort_by']) {
    queryString += groupBy + `ORDER BY articles.%I `;
    queryFormatParams.push(query['sort_by']);
  } else if (query.order === 'asc') {
    queryString += groupBy + `ORDER BY articles.created_at ASC`;
  } else {
    queryString += groupBy + 'ORDER BY articles.created_at DESC';
  }

  const formattedString = format(queryString, queryFormatParams[0]);
  return db.query(formattedString, queryParams).then(({ rows }) => {
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
  const promises = [checkExists('articles', 'article_id', article_id)];

  const queryString = format(
    `INSERT INTO comments
  (author, body, article_id, created_at)
  VALUES %L RETURNING *`,
    [[username, body, article_id, new Date()]]
  );
  promises.push(db.query(queryString));

  return Promise.all(promises).then(([_, { rows }]) => {
    return rows[0];
  });
};

const updateArticleById = ({ inc_votes, article_id }) => {
  return db
    .query(
      `UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'article not found' });
      }
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
