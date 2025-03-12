const { updateCommentById, removeComment } = require('../models');

const patchCommentById = (req, res, next) => {
  const { inc_votes } = req.body;
  const { comment_id } = req.params;
  updateCommentById({ inc_votes, comment_id }).then((comment) => {
    res.status(200).send({ comment });
  });
};

const deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { patchCommentById, deleteComment };
