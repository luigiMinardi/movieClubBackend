const express = require('express');
const router = express.Router();

const MovieController = require('../controllers/MovieController');

router.get('/search', MovieController.getSearchMovies);

router.get('/new', MovieController.getNewMovies);

module.exports = router;