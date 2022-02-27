const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');


const OrderController = require('../controllers/OrderController');

router.post('/', OrderController.postNewOrder);

router.get('/', auth, isAdmin, OrderController.getAllOrders);

router.get('/top-rated', auth, isAdmin, OrderController.getAllTopRatedOrders);

router.get('/:pk', auth, OrderController.getOrderById);

module.exports = router;