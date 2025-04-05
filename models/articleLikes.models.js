const db = require('../db/connection');
const { checkExists } = require('../db/seeds/utils');

const fetchArticleLikes = () => {
  return db.query('SELECT * FROM article_likes').then(({ rows }) => {
    return rows;
  });
};

const updateArticleLike = (username, article_id, liked) => {
  const promises = [
    checkExists('users', 'username', username),
    checkExists('articles', 'article_id', article_id),
  ];
  promises.unshift(
    db.query(
      `
    INSERT INTO article_likes (username, article_id, liked)
    VALUES ($1, $2, $3)
    ON CONFLICT (username, article_id)
    DO UPDATE SET liked = EXCLUDED.liked
    RETURNING *;
  `,
      [username, article_id, liked]
    )
  );

  return Promise.all(promises).then(([{ rows }]) => {
    return rows[0];
  });
};

const removeArticleLike = (username, article_id) => {
  const promises = [
    checkExists('article_likes', 'username', username),
    checkExists('article_likes', 'article_id', article_id),
  ];
  promises.push(
    db.query(
      `DELETE FROM article_likes WHERE username = $1 and article_id = $2`,
      [username, article_id]
    )
  );

  return Promise.all(promises).then(() => {
    return;
  });
};

module.exports = { fetchArticleLikes, updateArticleLike, removeArticleLike };
