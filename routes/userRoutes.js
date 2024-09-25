
const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.post('/signup', userController.createUser);
router.post('/signin', userController.login);
router.post('/forget-password', userController.forgetPassword);
router.post('/reset-password', userController.resetPassword);
router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
