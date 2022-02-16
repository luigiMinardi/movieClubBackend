const express = require('express');
const router = express.Router();

const MovieController = require('../controllers/MovieController');

router.get('/search', MovieController.getSearchMovies);

router.get('/new', MovieController.getNewMovies);

router.get('/latest', MovieController.getLatestMovie);

router.get('/bests', MovieController.getBestMovies);

router.get('/:pk', MovieController.getMovieById);

router.get('/similar_to/:pk', MovieController.getSimilarMovies);

router.get('/:pk/reviews', MovieController.getReviewByMovieId);

module.exports = router;