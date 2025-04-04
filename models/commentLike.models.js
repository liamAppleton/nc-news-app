const db = require('../db/connection');

const fetchCommentLike = (username, comment_id) => {
  return db
    .query(
      'SELECT * FROM comment_likes WHERE username = $1 AND comment_id = $2',
      [username, comment_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

module.exports = { fetchCommentLike };
