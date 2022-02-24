const express = require('express');
const router = express.Router();

const OrderController = require('../controllers/OrderController');

router.post('/', OrderController.postNewOrder);

router.get('/', OrderController.getAllOrders);

module.exports = router;