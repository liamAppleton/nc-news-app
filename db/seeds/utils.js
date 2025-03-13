const db = require('../../db/connection');
const format = require('pg-format');

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createLookUp = (articleData) => {
  const result = {};
  articleData.forEach(({ title, article_id }) => {
    const key = title;
    result[key] = article_id;
  });
  return result;
};

exports.formatDataWithId = (commentData, lookUp) => {
  return commentData.map((comment) => {
    const commentCopy = { ...comment };
    const { article_title } = commentCopy;
    const id = lookUp[article_title];
    delete commentCopy.article_title;
    const result = { article_id: id, ...commentCopy };
    return result;
  });
};

exports.checkExists = (table, column, value) => {
  const queryString = format('SELECT * FROM %I WHERE %I = $1', table, column);
  return db.query(queryString, [value]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: 'resource not found' });
    }
    return true;
  });
};

exports.countArticlesAfterFilter = (query) => {
  const promises = [];
  let queryString = `SELECT COUNT(*) FROM articles `;
  const queryParams = [];

  if (query.topic) {
    promises.push(this.checkExists('articles', 'topic', query.topic));
    queryString += `WHERE topic = $1 `;
    queryParams.push(query.topic);
  }

  promises.unshift(db.query(queryString, queryParams));

  return Promise.all(promises).then(([{ rows }, _]) => {
    return parseInt(rows[0].count);
  });
};

exports.countCommentsByArticleId = (articleId) => {
  const promises = [this.checkExists('articles', 'article_id', articleId)];
  const queryString = `SELECT COUNT(*) FROM comments WHERE article_id = $1`;
  promises.push(db.query(queryString, [articleId]));

  return Promise.all(promises).then(([_, { rows }]) => {
    return parseInt(rows[0].count);
  });
};
