const db = require('../db/connection.js');
const { checkExists } = require('../db/seeds/utils.js');

const removeComment = (commentId) => {
  const promises = [checkExists('comments', 'comment_id', commentId)];

  const queryString = `DELETE FROM comments WHERE comment_id = $1`;
  promises.push(db.query(queryString, [commentId]));

  return Promise.all(promises).then(() => {
    return;
  });
};

module.exports = { removeComment };
