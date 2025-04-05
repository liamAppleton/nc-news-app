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

module.exports = { fetchArticleLikes, updateArticleLike };
