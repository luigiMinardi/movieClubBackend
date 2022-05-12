const express = require('express');
const router = express.Router();

const MovieDBController = require('../controllers/MovieDBController');

router.get('/search', MovieDBController.getSearchMovies);

router.get('/new', MovieDBController.getNewMovies);

router.get('/latest', MovieDBController.getLatestMovie);

router.get('/top-rated', MovieDBController.getTopRatedMovies);

router.get('/:pk', MovieDBController.getMovieById);

router.get('/similar-to/:pk', MovieDBController.getSimilarMovies);

router.get('/:pk/reviews', MovieDBController.getReviewByMovieId);

module.exports = router;
