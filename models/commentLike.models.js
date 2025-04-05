const db = require('../db/connection');
const { checkExists } = require('../db/seeds/utils');

const fetchCommentLikes = () => {
  return db.query('SELECT * FROM comment_likes').then(({ rows }) => {
    return rows;
  });
};

const updateCommentLike = (username, comment_id, liked) => {
  const promises = [
    checkExists('users', 'username', username),
    checkExists('comments', 'comment_id', comment_id),
  ];
  promises.unshift(
    db.query(
      `
        UPDATE comment_likes
        SET liked = $1
        WHERE username = $2 and comment_id = $3
        RETURNING *`,
      [liked, username, comment_id]
    )
  );

  return Promise.all(promises).then(([{ rows }]) => {
    return rows[0];
  });
};

const removeCommentLike = (username, comment_id) => {
  const promises = [
    checkExists('comment_likes', 'username', username),
    checkExists('comment_likes', 'comment_id', comment_id),
  ];
  promises.push(
    db.query(
      `DELETE FROM comment_likes WHERE username = $1 and comment_id = $2`,
      [username, comment_id]
    )
  );

  return Promise.all(promises).then(() => {
    return;
  });
};

module.exports = {
  fetchCommentLikes,
  updateCommentLike,
  removeCommentLike,
};
