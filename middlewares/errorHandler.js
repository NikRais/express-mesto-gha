const serverResponse = require('../utils/serverResponse');

module.exports = (err, req, res, next) => {
  res.status(err.statusCode).send({
    message: err.statusCode === serverResponse.INTERNAL_SERVER_ERROR ? 'Ошибка на стороне сервера' : err.message,
  });
  return next();
};
