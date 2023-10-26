const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const serverResponse = require('../utils/serverResponse');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');

const salt = 10;

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(serverResponse.OK_REQUEST).send(users))
    .catch(next);
};

module.exports.getUsersById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь по id не найден'));
      }
      return res.status(serverResponse.OK_REQUEST).send(user);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new BadRequestError('Неправильный логин или пароль.'));
  }
  return User.findOne({ email }).then((user) => {
    if (user) {
      next(new ConflictError('Такой пользователь уже существует.'));
    }
    return bcrypt.hash(password, salt);
  })
    .then((hash) => User.create({
      email,
      password: hash,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    }))
    .then((user) => res.status(serverResponse.OK_REQUEST).send({
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Неверные данные о пользователе или ссылка'));
      }
      return next(err);
    });
};

module.exports.updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(serverResponse.OK_REQUEST).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Неверные данные.'));
      }
      return next(err);
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(serverResponse.OK_REQUEST).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Неверый адрес ссылки'));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user || !password) {
        return next(new BadRequestError('Неверная почта или пароль.'));
      }
      /* Создание токена */
      const token = jwt.sign({ _id: user._id }, 'top-secret-key', { expiresIn: '7d' });
      return res.send({ token });
    })
    .catch(next);
};

/* Текущий пользователь */
module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id).then((user) => {
    if (!user) {
      return next(new NotFoundError('Пользователь по id не найден.'));
    }
    return res.status(serverResponse.OK_REQUEST).send(user);
  }).catch(next);
};
