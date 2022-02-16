const router = require('express').Router();

const MovieRouter = require('./views/MovieRouter');

router.use('/movies', MovieRouter);

module.exports = router;