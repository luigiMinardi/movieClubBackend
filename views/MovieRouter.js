const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');0

const MovieController = require('../controllers/MovieController');

router.get('/', MovieController.getAllMovies);

router.get('/favorites',auth, MovieController.getFavorites);

router.get('/adult',auth, MovieController.getAdultMovies);

router.get('/:pk', auth, MovieController.getMovieById);

router.post('/',auth, isAdmin, MovieController.postNewMovie);

router.put('/:pk',auth, isAdmin, MovieController.putMovieById);

module.exports = router;