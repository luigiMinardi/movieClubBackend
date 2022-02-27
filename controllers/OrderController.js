const { Order } = require('../models/index');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

const OrderController = {};

OrderController.postNewOrder = (req, res) => {
    let body = req.body;

    let token = req.headers.authorization.split(' ')[1];
    let { user } = jwt.decode(token, authConfig.secret);
    let userId;
    if (!user.isAdmin) {
        userId = user.id; // if normal user use user id
    } else {
        userId = body.userId || user.id; // if adm use id passed in body, if none use user id
    }
    Order.create({
        price: body.price,
        movieId: body.movieId,
        userId: userId,
        date: body.date
    }).then(order => {
        if (order) {
            res.send(order)
        } else {
            res.status(500).json({ msg: `The order creation failed` });
        }
    }).catch((error => {
        res.status(400).send({ msg: `Something has gone wrong`, error: error })
    }))
}

OrderController.getAllTopRatedOrders = async (req, res) => {
    let query = `SELECT Users.name AS customer, Users.nickname AS nick, Users.email AS mail,
	Movies.title AS movie, Movies.popularity AS rating
    FROM Users
        INNER JOIN Orders ON Users.id = Orders.userId
        INNER JOIN Movies ON Movies.id = Orders.movieId
        WHERE popularity > 6 ORDER BY rating DESC`;
    // removed:
    // AND name LIKE '%Ra%'
    // TODO: turn this funcion in one dinamic function
    let outcome = await Order.sequelize.query(query, {
        type: Order.sequelize.QueryTypes.SELECT
    });
    if (outcome) {
        res.send(outcome);
    }
}

OrderController.getAllOrders = (req, res) => {
    try {
        Order.findAll().then(orders => {
            res.status(200).json(orders);
        });
    } catch (e) {
        res.status(400).json({ msg: 'Something unexpected happened', error: e })
    }
}

OrderController.getOrderById = (req, res) => {

    let id = req.params.pk;

    try {
        Order.findOne({
            where: {
                id: id
            }
        }).then(order =>
            order ? res.status(200).json(order) : res.status(404).json({msg: 'This order does not exist.'})
        );
    } catch (e) {
        res.status(400).json({ msg: 'Something unexpected happened', error: e })
    }
}

OrderController.deleteOrderById = (req, res) => {
    let id = req.params.pk;
    try {
        Order.findOne({
            where: { id: id },
        }).then(order => {
            let token = req.headers.authorization.split(' ')[1];
            let { user } = jwt.decode(token, authConfig.secret);
            if (!order) {
                res.status(404).json({ msg: `Order with id ${id} does not exists, you can't delete a phantom.` })
            } else if (order.userId == user.id || user.isAdmin) {
                order.destroy({
                    truncate: false
                });
                res.status(200).json({ msg: `Order with id ${id} was deleted.` });
            } else {
                res.status(403).json({ msg: `You aren't allowed to delete the order ${id}.` })
            }
        });
    } catch (error) {
        res.send(error);
    }
}

module.exports = OrderController;