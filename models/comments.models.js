const db = require('../db/connection.js');
const { checkExists } = require('../db/seeds/utils.js');

const updateCommentById = ({ inc_votes, comment_id }) => {
  return db
    .query(
      `UPDATE comments
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING *`,
      [inc_votes, comment_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: 'comment not found' });
      }
      return rows[0];
    });
};

const removeComment = (commentId) => {
  const promises = [checkExists('comments', 'comment_id', commentId)];

  const queryString = `DELETE FROM comments WHERE comment_id = $1`;
  promises.push(db.query(queryString, [commentId]));

  return Promise.all(promises).then(() => {
    return;
  });
};

module.exports = { updateCommentById, removeComment };
