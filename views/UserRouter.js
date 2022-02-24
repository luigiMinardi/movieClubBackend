const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');

const UserController = require('../controllers/UserController');

router.get('/', auth, UserController.getUser);

router.get('/:pk', auth, UserController.getUserById);

router.post('/email', auth, UserController.postFindUserByMail);

router.post('/', UserController.postNewUser);

router.post('/login', UserController.postLogin);

router.put('/:pk', auth, UserController.putUserById);

router.delete('/:pk', auth, UserController.deleteUserById);

module.exports = router;