const User = require('../models/user');
const {
  CREATED, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR,
} = require('../utils/serverResponse');

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
  }
};

module.exports.getUsersById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id)(req.params.id).orFail(new Error('NotFound'));
    return res.send(user);
  } catch (error) {
    if (error.message === 'NotFound') {
      return res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
    }

    if (error.name === 'CastError') {
      return res.status(BAD_REQUEST).send({ message: 'Передан не валидный id' });
    }

    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    // eslint-disable-next-line no-unused-vars
    const newUser = User.create({ name, about, avatar });
    return res.status(CREATED).send({ message: 'Пользователь успешно создан' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(BAD_REQUEST).send({ message: 'Ошибка валидации полей' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Не удалось создать пользователя' });
  }
};

module.exports.updateUserProfile = async (req, res) => {
  try {
    const { name, about } = req.body;
    const updateUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    );
    return res.send(updateUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(BAD_REQUEST).send({ message: 'Ошибка валидации полей' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Не удалось обновить профиль пользователя' });
  }
};

module.exports.updateUserAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const updateUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    );
    return res.send(updateUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(BAD_REQUEST).send({ message: 'Ошибка валидации полей' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Не удалось обновить аватар пользователя' });
  }
};
