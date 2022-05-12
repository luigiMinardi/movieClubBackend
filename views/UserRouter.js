const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

const UserController = require('../controllers/UserController');

router.post('/', UserController.postNewUser);

router.post('/email', auth, UserController.postFindUserByMail);

router.post('/login', UserController.postLogin);

router.get('/', auth, UserController.getAllUsers);

router.get('/:pk', auth, UserController.getUserById);

router.put('/:pk', auth, UserController.putUserById);

router.put('/:pk/update-password', auth, UserController.putNewPassword);

router.delete('/:pk', auth, isAdmin, UserController.deleteUserById);

module.exports = router;
