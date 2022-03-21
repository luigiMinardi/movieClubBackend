const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin'); 0

const MovieController = require('../controllers/MovieController');

router.post('/', auth, isAdmin, MovieController.postNewMovie);

router.get('/', MovieController.getAllMovies);

router.get('/clone', auth, isAdmin, MovieController.cloneMovies)

router.get('/favorites', auth, MovieController.getFavorites);

router.get('/adult', auth, MovieController.getAdultMovies);

router.get('/:pk', auth, MovieController.getMovieById);

router.put('/:pk', auth, isAdmin, MovieController.putMovieById);

router.delete('/', auth, isAdmin, MovieController.deleteAllMovies);

router.delete('/:pk', auth, isAdmin, MovieController.deleteMovieById);

module.exports = router;