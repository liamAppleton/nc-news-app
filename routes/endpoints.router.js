const endpointsRouter = require('express').Router();
const { getEndpoints } = require('../controllers');

endpointsRouter.route('/').get(getEndpoints);

module.exports = endpointsRouter;
