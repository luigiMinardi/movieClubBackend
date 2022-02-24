const { User } = require('../models/index');


module.exports = (req, res, next) => {

    let id = req.body.id;

    User.findOne({
        where: { id: id }
    }).then(foundUser => {
        // remove the == 1 to test if works the same way
        if (foundUser.isAdmin == 1) {
            next();
        } else {
            res.status(401).send({ msg: `User is not allowed.` });
        }
    }).catch(error => {
        res.status(400).json({
            msg: `Something bad happened, try to check the infos you put and try again.`,
            error: error
        });
    })

};