const express = require('express');
const router = express.Router();

const MovieController = require('../controllers/MovieController');

router.get('/search', MovieController.getSearchMovies);

router.get('/new', MovieController.getNewMovies);

router.get('/:pk', MovieController.getMovieById);

router.get('/:pk/reviews', MovieController.getReviewByMovieId);

router.get('/latest', MovieController.getLatestMovie);

router.get('/best', MovieController.getBestMovie);

module.exports = router;