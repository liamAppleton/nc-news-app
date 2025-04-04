const db = require('../db/connection');
const { checkExists } = require('../db/seeds/utils');

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
      return Promise.reject({ status: 404, msg: 'user not found' });
    }
    return rows[0];
  });
};

module.exports = { fetchCommentLike };
