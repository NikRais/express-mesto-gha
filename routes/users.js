const userRouter = require('express').Router();

const {
  createUser, getUsers, getUsersById, updateUserProfile, updateUserAvatar,
} = require('../controllers/users');

userRouter.get('/', getUsers);
userRouter.get('/:id', getUsersById);
userRouter.post('/', createUser);
userRouter.patch('/me', updateUserProfile);
userRouter.patch('/me/avatar', updateUserAvatar);

module.exports = userRouter;
