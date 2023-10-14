const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Имя пользователя должно содержать минимум 2 символа'],
    maxlength: [30, 'Имя пользователя может содержать максимум 30 символов'],
    required: [true, 'Поле "name" должно быть заполнено'],
  },
  about: {
    type: String,
    minlength: [2, 'Информация о пользователе должна содержать минимум 2 символа'],
    maxlength: [30, 'Информация о пользователе не может превышать 30 символов'],
    required: [true, 'Поле "about" должно быть заполнено'],

  },
  avatar: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
