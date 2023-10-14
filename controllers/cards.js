const Card = require('../models/card');
const {
  errorsResponse, OK_REQUEST, NOT_FOUND, CREATED,
} = require('../utils/serverResponse');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(OK_REQUEST).send(cards))
    .catch((err) => errorsResponse(err, res));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CREATED).send(card))
    .catch((err) => errorsResponse(err, res));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Не удалось найти карточку' });
      }
      return res.status(OK_REQUEST).send(card);
    })
    .catch((err) => errorsResponse(err, res));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Не удалось найти карточку' });
      }
      return res.status(OK_REQUEST).send(card);
    })
    .catch((err) => errorsResponse(err, res));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Не удалось найти карточку' });
      }
      return res.status(OK_REQUEST).send(card);
    })
    .catch((err) => errorsResponse(err, res));
};
