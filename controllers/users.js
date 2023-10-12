const { ValidationError, CastError } = require('mongoose').Error;
const User = require('../models/user');
const {
  errorsResponse, OK_REQUEST, NOT_FOUND, BAD_REQUEST, INTERNAL_SERVER_ERROR,
} = require('../utils/serverResponse');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK_REQUEST).send(users))
    .catch((err) => errorsResponse(err, res));
};

module.exports.getUsersById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotFound'))
    .then((user) => res.status(OK_REQUEST).send(user))
    .catch((error) => {
      if (error.message === 'NotFound') {
        return res.status(NOT_FOUND).send({ message: 'Пользователь по id не найден' });
      }
      if (error instanceof CastError) {
        return res.status(BAD_REQUEST);
      }
      return res.status(INTERNAL_SERVER_ERROR);
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(200).send(user))
    .catch((err) => errorsResponse(err, res));
};

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(OK_REQUEST).send(user))
    .catch((err) => errorsResponse(err, res));
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(OK_REQUEST).send(user))
    .catch((err) => errorsResponse(err, res));
};
