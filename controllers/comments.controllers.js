const { removeComment } = require('../models');

const deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id).then(() => {
    res.status(204).send();
  });
};

module.exports = { deleteComment };
