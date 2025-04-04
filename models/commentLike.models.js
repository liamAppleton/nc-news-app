const db = require('../db/connection');
const format = require('pg-format');

const fetchCommentLike = (username, comment_id) => {
  const promises = [];
  promises.push(
    db.query(
      'SELECT * FROM comment_likes WHERE username = $1 AND comment_id = $2',
      [username, comment_id]
    )
  );

  return Promise.all(promises).then(([{ rows }]) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: 'like not found' });
    }
    return rows[0];
  });
};

const addCommentLike = ({ username, comment_id, liked }) => {
  const queryString = format(
    `INSERT INTO comment_likes
    (username, comment_id, liked)
    VALUES %L RETURNING *`,
    [[username, comment_id, liked]]
  );
  return db.query(queryString).then(({ rows }) => {
    return rows[0];
  });
};

module.exports = { fetchCommentLike, addCommentLike };
