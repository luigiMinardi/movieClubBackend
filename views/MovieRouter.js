const express = require('express');
const router = express.Router();

const MovieController = require('../controllers/MovieController');

router.get('/favorites', MovieController.getFavorites);

router.get('/adult', MovieController.getAdultMovies);

module.exports = router;