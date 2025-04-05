const db = require('../db/connection');
const { checkExists } = require('../db/seeds/utils');

const fetchArticleLikes = () => {
  return db.query('SELECT * FROM article_likes').then(({ rows }) => {
    return rows;
  });
};

module.exports = { fetchArticleLikes };
