const db = require('../connection');
const format = require('pg-format');
const {
  convertTimestampToDate,
  createLookUp,
  formatDataWithId,
} = require('./utils.js');
const { articleLikesData } = require('../data/test-data/index.js');

const createTopics = (topicData) => {
  return db
    .query(
      `CREATE TABLE topics
  (slug VARCHAR NOT NULL, description VARCHAR NOT NULL, img_url VARCHAR(1000), PRIMARY KEY (slug))`
    )
    .then(() => {
      const formattedTopics = topicData.map(
        ({ description, slug, img_url }) => {
          return [description, slug, img_url];
        }
      );
      const queryString = format(
        `INSERT INTO topics
  (description, slug, img_url)
  VALUES %L RETURNING *`,
        formattedTopics
      );
      return db.query(queryString);
    });
};

const createUsers = (userData) => {
  return db
    .query(
      `CREATE TABLE users
  (username VARCHAR NOT NULL, name VARCHAR NOT NULL, avatar_url VARCHAR(1000), PRIMARY KEY (username))`
    )
    .then(() => {
      const formattedUsers = userData.map(({ username, name, avatar_url }) => {
        return [username, name, avatar_url];
      });
      const queryString = format(
        `INSERT INTO users
  (username, name, avatar_url)
  VALUES %L RETURNING *`,
        formattedUsers
      );
      return db.query(queryString);
    });
};

const createArticles = (articleData) => {
  return db
    .query(
      `CREATE TABLE articles
    (article_id SERIAL PRIMARY KEY, title VARCHAR NOT NULL, topic VARCHAR REFERENCES topics(slug) NOT NULL,
    author VARCHAR REFERENCES users(username) NOT NULL, body TEXT, created_at TIMESTAMP NOT NULL,
    votes INT DEFAULT 0, article_img_url VARCHAR(1000))`
    )
    .then(() => {
      const timeFormattedArticles = articleData.map((article) => {
        return convertTimestampToDate(article);
      });
      const formattedArticles = timeFormattedArticles.map(
        ({
          title,
          topic,
          author,
          body,
          created_at,
          votes,
          article_img_url,
        }) => {
          return [
            title,
            topic,
            author,
            body,
            created_at,
            votes,
            article_img_url,
          ];
        }
      );
      const queryString = format(
        `INSERT INTO articles
        (title, topic, author, body, created_at, votes, article_img_url)
        VALUES %L RETURNING *`,
        formattedArticles
      );
      return db.query(queryString);
    });
};

const createComments = (commentData, articleData) => {
  return db
    .query(
      `CREATE TABLE comments
    (comment_id SERIAL PRIMARY KEY, article_id INT REFERENCES articles(article_id) ON DELETE CASCADE NOT NULL, body TEXT NOT NULL,
    votes INT DEFAULT 0, author VARCHAR REFERENCES users(username), created_at TIMESTAMP NOT NULL)`
    )
    .then(() => {
      const lookUp = createLookUp(articleData);
      const commentDataWithArticleId = formatDataWithId(commentData, lookUp);
      const commentDataWithDateFormatted = commentDataWithArticleId.map(
        (comment) => {
          return convertTimestampToDate(comment);
        }
      );
      const formattedCommentData = commentDataWithDateFormatted.map(
        ({ article_id, body, votes, author, created_at }) => {
          return [article_id, body, votes, author, created_at];
        }
      );
      const queryString = format(
        `INSERT INTO comments
        (article_id, body, votes, author, created_at)
        VALUES %L RETURNING *`,
        formattedCommentData
      );
      return db.query(queryString);
    });
};

const createCommentLikes = (commentLikesData) => {
  return db
    .query(
      `CREATE TABLE comment_likes
  (username VARCHAR REFERENCES users(username), comment_id INT REFERENCES comments(comment_id) ON DELETE CASCADE, liked BOOLEAN, PRIMARY KEY (username, comment_id))`
    )
    .then(() => {
      const formattedCommentLikeData = commentLikesData.map(
        ({ username, comment_id, liked }) => {
          return [username, comment_id, liked];
        }
      );
      const queryString = format(
        `INSERT INTO comment_likes 
        (username, comment_id, liked)
        VALUES %L RETURNING *`,
        formattedCommentLikeData
      );
      return db.query(queryString);
    });
};

const createArticleLikes = (articleLikesData) => {
  return db
    .query(
      `CREATE TABLE article_likes
    (username VARCHAR REFERENCES users(username), article_id INT REFERENCES articles(article_id) ON DELETE CASCADE, liked BOOLEAN, PRIMARY KEY (username, article_id))`
    )
    .then(() => {
      const formattedArticleLikeData = articleLikesData.map(
        ({ username, article_id, liked }) => {
          return [username, article_id, liked];
        }
      );
      const queryString = format(
        `INSERT INTO article_likes
        (username, article_id, liked)
        VALUES %L RETURNING *`,
        formattedArticleLikeData
      );
      return db.query(queryString);
    });
};

const seed = ({
  topicData,
  userData,
  articleData,
  commentData,
  commentLikesData,
  articleLikesData,
}) => {
  return db
    .query(`DROP TABLE IF EXISTS comment_likes`)

    .then(() => db.query(`DROP TABLE IF EXISTS comments`))
    .then(() => db.query(`DROP TABLE IF EXISTS article_likes`))
    .then(() => db.query(`DROP TABLE IF EXISTS articles`))
    .then(() => db.query(`DROP TABLE IF EXISTS users`))
    .then(() => db.query(`DROP TABLE IF EXISTS topics`))
    .then(() => createTopics(topicData))
    .then(() => createUsers(userData))
    .then(() => createArticles(articleData))
    .then(({ rows }) => {
      return createComments(commentData, rows);
    })
    .then(() => createArticleLikes(articleLikesData))
    .then(() => createCommentLikes(commentLikesData));
};

module.exports = seed;
