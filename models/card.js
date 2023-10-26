const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const isURL = require('validator/lib/isURL');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Имя карточки должно содержать минимум 2 символа'],
    maxlength: [30, 'Имя карточки может содержать максимум 30 символов'],
    required: [true, 'Поле "name" должно быть заполнено'],
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (link) => isURL(link),
      message: 'Введите URL адрес',
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: [true, 'Поле должно быть заполнено'],
    ref: 'user',
  },
  likes: {
    type: [Schema.Types.ObjectId],
    default: [],
    ref: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
