const router = require('express').Router();

const MovieRouter = require('./views/MovieRouter');
const MovieDBRouter = require('./views/MovieDBRouter');
const UserRouter = require('./views/UserRouter');
const OrderRouter = require('./views/OrderRouter');

router.use('/movies', MovieRouter);
router.use('/movies-db', MovieDBRouter);
router.use('/users', UserRouter);
router.use('/orders', OrderRouter);

module.exports = router;