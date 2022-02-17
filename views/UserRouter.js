const express = require('express');
const router = express.Router();

const UserController = require('../controllers/UserController');

router.get('/', UserController.getUser);

router.get('/:pk', UserController.getUserById);

router.get('/email', UserController.getUserMail);

router.post('/', UserController.postUser);

router.post('/login', UserController.login);


module.exports = router;