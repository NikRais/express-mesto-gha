const CREATED = 201;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;

const errorsResponse = (err, res) => {
  if (err.name === 'CastError') {
    return res
      .status(BAD_REQUEST)
      .send({ message: `Ошибка ${BAD_REQUEST}.` });
  }
  if (err.name === 'ValidationError') {
    return res
      .status(BAD_REQUEST)
      .send({ message: 'Ошибка валидации полей' });
  }

  return res
    .status(INTERNAL_SERVER_ERROR)
    .send({ message: `Ошибка сервера ${INTERNAL_SERVER_ERROR}` });
};

module.exports = {
  CREATED,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  errorsResponse,
};
