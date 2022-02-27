const { Order } = require('../models/index');

const OrderController = {};

OrderController.postNewOrder = (req, res) => {
    let body = req.body;

    Order.create({
        price: body.price,
        movieId: body.movieId,
        userId: body.userId,
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

    let id = req.params.pk

    try {
        Order.findOne({
            where: {
                id: id
            }
        }).then(order => res.status(200).json(order));
    } catch (e) {
        res.status(400).json({ msg: 'Something unexpected happened', error: e })
    }
}

module.exports = OrderController;