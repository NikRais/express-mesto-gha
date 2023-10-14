const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const errorCode = require('./utils/serverResponse');

const { PORT = 3000 } = process.env;

const app = express();
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use((req, res, next) => {
  req.user = { _id: '652780c7d0990763fdd622c3' };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('*', (req, res) => res.status(errorCode.NOT_FOUND).send({ message: 'Запрашиваемый адрес не найден' }));

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
