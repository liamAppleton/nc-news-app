const handlePsqlError = (err, req, res, next) => {
  if (err.code === '42703') {
    res.status(400).send({ status: 400, msg: 'bad request' });
  } else next(err);
};

module.exports = { handlePsqlError };
