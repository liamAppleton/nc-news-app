const db = require('../../db/connection');

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.createLookUp = (articleData) => {
  const result = {};
  articleData.forEach(({ title, article_id }) => {
    const key = title;
    result[key] = article_id;
  });
  return result;
};

exports.formatDataWithId = (commentData, lookUp) => {
  return commentData.map((comment) => {
    const commentCopy = { ...comment };
    const { article_title } = commentCopy;
    const id = lookUp[article_title];
    delete commentCopy.article_title;
    const result = { article_id: id, ...commentCopy };
    return result;
  });
};
