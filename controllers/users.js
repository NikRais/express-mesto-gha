const { CastError } = require('mongoose').Error;
const User = require('../models/user');
const errorCode = require('../utils/serverResponse');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(errorCode.OK_REQUEST).send(users))
    .catch((err) => errorCode.errorsResponse(err, res));
};

module.exports.getUsersById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(new Error('NotFound'))
    .then((user) => res.status(errorCode.OK_REQUEST).send(user))
    .catch((error) => {
      if (error.message === 'NotFound') {
        return res.status(errorCode.NOT_FOUND).send({ message: 'Пользователь по id не найден' });
      }
      if (error instanceof CastError) {
        return res.status(errorCode.BAD_REQUEST).send({ message: 'Передан невалидный id' });
      }
      return res.status(errorCode.INTERNAL_SERVER_ERROR);
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(errorCode.OK_REQUEST).send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    }))
    .catch((err) => errorCode.errorsResponse(err, res));
};

module.exports.updateUserProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(errorCode.OK_REQUEST).send(user))
    .catch((err) => errorCode.errorsResponse(err, res));
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(errorCode.OK_REQUEST).send(user))
    .catch((err) => errorCode.errorsResponse(err, res));
};
