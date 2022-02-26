const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');0

const MovieController = require('../controllers/MovieController');

router.get('/favorites',auth, MovieController.getFavorites);

router.get('/adult',auth, MovieController.getAdultMovies);

router.post('/',auth, isAdmin, MovieController.postNewMovie);

module.exports = router;