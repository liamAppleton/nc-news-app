const db = require('./connection');

// get all users
const getAllUsers = async () => {
  const { rows } = await db.query(`SELECT * FROM users`);
  return rows;
};
// getAllUsers().then((data) => {
//   console.log(data);
//   db.end();
// });

// get all articles where topic is coding
const getArticlesTopicCoding = () => {
  return db
    .query(`SELECT * FROM articles WHERE topic = 'coding'`)
    .then(({ rows }) => {
      console.log(rows);
      db.end();
    });
};
// getArticlesTopicCoding();

// get all comments where votes are less than 0
const getBadComments = () => {
  return db.query(`SELECT * FROM comments WHERE votes < 0`).then(({ rows }) => {
    console.log(rows);
    db.end();
  });
};
// getBadComments();

// get all topics
const getAllTopics = () => {
  return db.query(`SELECT slug FROM topics`).then(({ rows }) => {
    console.log(rows);
    db.end();
  });
};
// getAllTopics();

const articlesByGrumpy = () => {
  return db
    .query(`SELECT title, author FROM articles WHERE author = 'grumpy19'`)
    .then(({ rows }) => {
      console.log(rows);
      db.end();
    });
};
// articlesByGrumpy();

const getGoodComments = () => {
  return db
    .query(`SELECT * FROM comments WHERE votes > 10`)
    .then(({ rows }) => {
      console.log(rows);
      db.end();
    });
};
// getGoodComments();
