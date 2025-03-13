const db = require('../db/connection.js');
const format = require('pg-format');
const {
  checkExists,
  countArticlesAfterFilter,
  countCommentsByArticleId,
} = require('../db/seeds/utils.js');

const fetchArticleById = (articleId) => {
  return db
    .query(
      `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at,
       articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count 
       FROM articles LEFT JOIN comments 
       ON articles.article_id = comments.article_id 
       WHERE articles.article_id = $1
       GROUP BY articles.article_id, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url`,
      [articleId]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'article not found' });
      }
      return rows[0];
    });
};

const fetchArticles = async (query) => {
  const totalCount = await countArticlesAfterFilter(query);

  const promises = [];

  let queryString = `SELECT articles.article_id, articles.title, articles.topic, articles.created_at,
       articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count 
       FROM articles LEFT JOIN comments 
       ON articles.article_id = comments.article_id `;

  const groupBy = `GROUP BY articles.article_id, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url `;

  const queryFormatParams = [];
  const queryParams = [];

  if (query.topic) {
    promises.push(checkExists('articles', 'topic', query.topic));
    queryString += `WHERE articles.topic = $1 `;
    queryParams.push(query.topic);
  }

  if (query['sort_by']) {
    queryString += groupBy + `ORDER BY articles.%I `;
    queryFormatParams.push(query['sort_by']);
  } else if (query.order === 'asc') {
    queryString += groupBy + `ORDER BY articles.created_at ASC `;
  } else {
    queryString += groupBy + 'ORDER BY articles.created_at DESC ';
  }

  let limit = `LIMIT ${query.topic ? '$2 ' : '$1 '}`;
  if (!query.limit || query.limit === '' || query.limit > totalCount) {
    query.limit = 10;
  }
  queryParams.push(query.limit);

  if (query.p) {
    const totalPages = Math.ceil(totalCount / query.limit);
    query.p = query.p > totalPages ? totalPages : query.p;

    limit += `OFFSET ${query.topic ? '$3' : '$2'}`;
    const paginationValue = parseInt(query.p - 1) * parseInt(query.limit);
    queryParams.push(paginationValue);
  }

  const formattedString = format(queryString + limit, queryFormatParams[0]);

  promises.unshift(db.query(formattedString, queryParams));
  return Promise.all(promises).then(([{ rows }]) => {
    return { total_count: totalCount, rows };
  });
};

const addArticle = ({ author, title, body, topic, article_img_url }) => {
  const queryString = format(
    `INSERT INTO articles
  (author, title, body, topic, article_img_url, votes, created_at)
  VALUES %L RETURNING article_id`,
    [[author, title, body, topic, article_img_url || 'N/A', 0, new Date()]]
  );
  return db
    .query(queryString)
    .then(({ rows }) => {
      const articleId = rows[0]['article_id'];
      return fetchArticleById(articleId);
    })
    .then((article) => {
      return article;
    });
};

const fetchCommentsByArticleId = async ({ query, article_id }) => {
  const commentCount = await countCommentsByArticleId(article_id);
  const promises = [checkExists('articles', 'article_id', article_id)];

  const queryString = `SELECT comment_id, article_id, body, votes, author, created_at
    FROM comments WHERE article_id = $1
    ORDER BY created_at DESC `;
  const queryParams = [article_id];

  let limit = `LIMIT $2 `;
  if (!query.limit || query.limit === '' || query.limit > commentCount) {
    query.limit = '10';
  }
  queryParams.push(query.limit);

  if (query.p) {
    const totalPages = Math.ceil(commentCount / query.limit);
    query.p = query.p > totalPages ? totalPages : query.p;

    limit += `OFFSET $3`;
    const paginationValue = parseInt(query.p - 1) * parseInt(query.limit);
    queryParams.push(paginationValue);
  }
  promises.push(db.query(queryString + limit, queryParams));

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

const removeArticle = (articleId) => {
  const promises = [checkExists('articles', 'article_id', articleId)];

  const queryString = `DELETE FROM articles WHERE article_id = $1`;
  promises.push(db.query(queryString, [articleId]));

  return Promise.all(promises).then(() => {
    return;
  });
};

module.exports = {
  fetchArticleById,
  fetchArticles,
  addArticle,
  fetchCommentsByArticleId,
  addCommentByArticleId,
  updateArticleById,
  removeArticle,
};
