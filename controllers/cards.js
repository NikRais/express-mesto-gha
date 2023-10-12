const Card = require('../models/card');
const {
  CREATED, BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR,
} = require('../utils/serverResponse');

const USER_REF = [{ path: 'likes', model: 'user' }];

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
  }
};

module.exports.createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    // eslint-disable-next-line no-unused-vars
    const card = await Card.create({ name, link, owner: req.user._id });
    return res.status(CREATED).send({ message: 'Успешное создание карточки' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(BAD_REQUEST).send({ message: 'Ошибка валидации полей' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Не удалось создать карточку' });
  }
};

module.exports.deleteCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) {
      return res.status(NOT_FOUND).send({ message: 'Не удалось найти карточку' });
    }
    // eslint-disable-next-line no-unused-vars
    const cardDelete = await Card.findByIdAndRemove(req.params.cardId);
    return res.send({ message: 'Карточка успешно удалена' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(BAD_REQUEST).send({ message: 'Переданы невалидные данные' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка на стороне сервера' });
  }
};

const handleCardLike = async (req, res, options) => {
  try {
    const cardLike = options.addLike ? '$addToSet' : '$pull';
    const updateCard = await Card.findOneAndUpdate(
      req.params.cardId,
      { [cardLike]: { likes: req.user._id } },
      { new: true },
    ).populate(USER_REF);

    if (!updateCard) {
      return res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
    }

    return res.send(updateCard);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(BAD_REQUEST).send({ message: 'Переданы невалидные данные' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Не удалось поставить/ удалить лайк' });
  }
};

module.exports.likeCard = (req, res) => {
  handleCardLike(req, res, { addLike: true });
};

module.exports.dislikeCard = (req, res) => {
  handleCardLike(req, res, { addLike: false });
};
