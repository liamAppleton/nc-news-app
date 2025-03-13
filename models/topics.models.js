const db = require('../db/connection');
const format = require('pg-format');

const fetchTopics = () => {
  return db.query('SELECT * FROM topics').then(({ rows }) => {
    return rows;
  });
};

const addTopic = ({ slug, description }) => {
  const queryString = format(
    `INSERT INTO topics (slug, description)
    VALUES %L RETURNING *`,
    [[slug, description]]
  );
  return db.query(queryString).then(({ rows }) => {
    return rows[0];
  });
};

module.exports = { fetchTopics, addTopic };
