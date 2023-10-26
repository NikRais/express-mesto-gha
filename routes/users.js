const userRouter = require('express').Router();

const {
  getUsers, getUsersById, getCurrentUser, updateUserProfile, updateUserAvatar,
} = require('../controllers/users');
const {
  userIdValidation, updateUserValidation, updateAvatarValidation,
} = require('../middlewares/validations');

userRouter.get('/', getUsers);
userRouter.get('/me', getCurrentUser);
userRouter.get('/:userId', userIdValidation, getUsersById);
userRouter.patch('/me', updateUserValidation, updateUserProfile);
userRouter.patch('/me/avatar', updateAvatarValidation, updateUserAvatar);

module.exports = userRouter;
