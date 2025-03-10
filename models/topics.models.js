const db = require('../db/connection');

const fetchTopics = (query) => {
  let queryString = 'SELECT * FROM topics ';

  if (query['sort_by']) {
    queryString += `ORDER BY ${query['sort_by']} ASC`;
  }

  return db.query(queryString).then(({ rows }) => {
    return rows;
  });
};

module.exports = { fetchTopics };
