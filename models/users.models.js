const db = require('../db/connection.js');

const fetchUsers = () => {
  return db.query('SELECT * FROM users').then(({ rows }) => {
    return rows;
  });
};

const fetchUserByUsername = (username) => {
  return db
    .query('SELECT * FROM users WHERE username = $1', [username])
    .then(({ rows }) => {
      console.log(rows);
      return rows[0];
    });
};

module.exports = { fetchUsers, fetchUserByUsername };
