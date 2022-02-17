const { User } = require('../models/index');
const UserController = {};

UserController.getUser = (req, res) => {
    try {
        User.findAll()
            .then(data => {
                res.send(data);
            });
    } catch (err) {
        res.send(err);
    }
}

UserController.postUser = (req, res) => {

    try {
        let name = req.body.name;
        let age = req.body.age;
        let surname= req.body.surname;
        let nickname = req.body.nickname;
        let email = req.body.email;

        User.create({
            name: name,
            age: age,
            surname: surname,
            nickname: nickname,
            email: email
        }).then(user => {
            console.log('user: ', user);
            res.send(`${user.name}, welcome!`);
        });

    } catch (error) {
        res.send(error);
    }
}

UserController.login = (req, res) => {

}

UserController.getUserById = (req, res) => {
    try {
        User.findByPk(req.params.pk)
            .then(data => {
                res.send(data)
        });
    } catch (err) {
        res.send(err);
    }
}

UserController.getUserMail = (req, res) => {
    console.log(req.body)
    try {
        User.findOne({where: {email: req.body.email}})
            .then(data => {
                res.send(data);
            });
    } catch (err) {
        res.send(err)
    }
}

module.exports = UserController;