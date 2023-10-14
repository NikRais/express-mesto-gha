const mongoose = require('mongoose');
const { Schema } = require('mongoose');

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
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
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
