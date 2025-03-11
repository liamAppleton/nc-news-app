const db = require('../db/connection.js');

const removeComment = (commentId) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1`, [commentId])
    .then(() => {
      return;
    });
};

module.exports = { removeComment };
