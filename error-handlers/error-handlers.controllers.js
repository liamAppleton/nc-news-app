const handlePsqlError = (err, req, res, next) => {
  if (err.code === '42703' || err.code == '22P02') {
    res.status(400).send({ status: 400, msg: 'bad request' });
  } else next(err);
};

const handleServerError = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: 'internal server error' });
};

module.exports = { handlePsqlError, handleServerError };
