const handleNotARouteError = (req, res, next) => {
  res.status(404).send({ status: 404, msg: 'not a route' });
};

const handlePsqlError = (err, req, res, next) => {
  if (err.code === '42703' || err.code == '22P02') {
    res.status(400).send({ status: 400, msg: 'bad request' });
  } else next(err);
};

const handleCustomError = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ status: err.status, msg: err.msg });
  } else next(err);
};

const handleServerError = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: 'internal server error' });
};

module.exports = {
  handleNotARouteError,
  handlePsqlError,
  handleCustomError,
  handleServerError,
};
