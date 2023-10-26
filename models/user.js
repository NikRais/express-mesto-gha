const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');
const isEmail = require('validator/lib/isEmail');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Имя пользователя должно содержать минимум 2 символа'],
    maxlength: [30, 'Имя пользователя может содержать максимум 30 символов'],
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: [2, 'Информация о пользователе должна содержать минимум 2 символа'],
    maxlength: [30, 'Информация о пользователе не может превышать 30 символов'],
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (link) => isURL(link),
      message: 'Введите URL адрес',
    },
  },
  email: {
    type: String,
    validate: {
      validator: (email) => isEmail(email),
      message: 'Неправильно указан формат почты',
    },
    required: [true, 'Поле должно быть заполнено'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findOneFunc(email, password) {
  return this.findOne({ email }).select('+password').then((user) => {
    /* Если пользователя не удалось найти, то отклоняем промис */
    if (!user) {
      return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
    }
    /* Если пользователя удалось найти, то сравниваем хеши */
    return bcrypt.compare(password, user.password).then((matched) => {
      /* Отклоняем промис */
      if (!matched) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }
      return user;
    });
  });
};

module.exports = mongoose.model('user', userSchema);
