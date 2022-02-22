const express = require('express');
const router = express.Router();

const UserController = require('../controllers/UserController');

router.get('/', UserController.getUser);

router.get('/email', UserController.getUserByMail);

router.post('/', UserController.postUser);

router.post('/login', UserController.login);

router.get('/:pk', UserController.getUserById);


module.exports = router;