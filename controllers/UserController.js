const { User } = require('../models/index');
const bcrypt = require('bcrypt');
const authConfig = require('../config/auth');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const UserController = {};

UserController.getAllUsers = (req, res) => {
    try {
        User.findAll()
            .then(data => {
                res.send(data);
            });
    } catch (err) {
        res.send(err);
    }
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

UserController.postNewUser = (req, res) => {

    try {
        let name = req.body.name;
        let age = req.body.age;
        let surname = req.body.surname;
        let nickname = req.body.nickname;
        let email = req.body.email;
        if (!req.body.password) {
            let error = new Error('You need to pass a password.')
            error.name = 'Missing Password'
            throw error;
        }
        let password = bcrypt.hashSync(req.body.password, Number.parseInt(authConfig.rounds));
        let isAdmin = req.body.isAdmin || false;

        User.findAll({
            where: {

                [Op.or]: [
                    {
                        email: {
                            [Op.like]: email
                        }
                    },
                    {
                        nickname: {
                            [Op.like]: nickname
                        }
                    }
                ]

            }

        }).then(usersWithSameEmailOrNickname => {

            if (usersWithSameEmailOrNickname == 0) {

                User.create({
                    name: name,
                    age: age,
                    surname: surname,
                    nickname: nickname,
                    email: email,
                    password: password,
                    isAdmin: isAdmin
                }).then(user => {
                    res.status(201).json({ msg: `${user.name}, welcome!`, user: user });
                }).catch(err => res.status(400).json({ msg: `Something unexpected happened while creating user`, error: { name: err.name, message: err.message, detail: err } }));

            } else {
                console.log(usersWithSameEmailOrNickname);
                res.status(200).json({ msg: 'The user with this email or nickname is already registered.' });
            }
        });

    } catch (error) {
        res.status(422).json({ msg: `Something unexpected happened while getting user data.`, error: { name: error.name, message: error.message, detail: error } });
    }
}

UserController.postLogin = (req, res) => {

    let email = req.body.email;
    let password = req.body.password;

    User.findOne({
        where: { email: email }
    }).then(user => {
        if (!user) {
            res.status(400).json({ msg: "Invalid user or password." });
        } else {

            // user exists, now checking if the password is valid
            if (bcrypt.compareSync(password, user.password)) { // decrypt db pass and check if is the same as the one sent by the user 

                let token = jwt.sign({ user: user }, authConfig.secret, {
                    expiresIn: authConfig.expires
                });

                res.status(200).json({
                    user: user,
                    token: token
                })
            } else {
                res.status(401).json({ msg: "Invalid user or password." });
            }
        };


    }).catch(error => {
        res.send(error);
    })
}

UserController.postFindUserByMail = (req, res) => {
    try {
        User.findOne({ where: { email: req.body.email } })
            .then(data => {
                res.send(data);
            });
    } catch (err) {
        res.send(err)
    }
}

UserController.putUserById = async (req, res) => {

    let data = req.body;
    let id = req.params.pk;

    try {
        User.update(data, {
            where: { id: id }
        }).then(updatedUser => {
            res.status(200).json({ msg: `User with id ${id} was updated.`, user: updatedUser });
        }).catch(error => res.status(422).json({ msg: `Something unexpected happened while updating user data.`, error: { name: error.name, message: error.message, detail: error } }));

    } catch (error) {
        res.status(422).json({ msg: `Something unexpected happened while getting user data.`, error: { name: error.name, message: error.message, detail: error } });
    }
}

UserController.putNewPassword = (req, res) => {

    let id = req.params.pk;
    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;

    User.findOne({
        where: { id: id }
    }).then(userFound => {
        if (userFound) {

            if (bcrypt.compareSync(oldPassword, userFound.password)) {
                newPassword = bcrypt.hashSync(newPassword, Number.parseInt(authConfig.rounds));
                let data = {
                    password: newPassword
                }
                userFound.update(data, {})
                    .then(updated => {
                        res.send(updated);
                    })
                    .catch((error) => {
                        res.status(400).json({
                            msg: `Some error happened while updating the password.`,
                            error: error
                        });
                    });

            } else {
                res.status(401).json({ msg: "Invalid user or password." });
            }
        } else {
            res.status(404).send(`User not found.`);
        }
    }).catch((error => {
        res.status(400).json({ msg: `Something unexpected happened.`, error: { name: error.name, message: error.message } });
    }));

};

UserController.deleteUserById = async (req, res) => {

    let id = req.params.pk;

    try {
        User.findOne({
            where: { id: id },
        }).then(user => {
            if (user) {
                user.destroy({
                    truncate: false
                })
                res.status(200).json({ msg: `User with id ${id} was deleted.` });
            } else {
                res.status(404).json({ msg: `User with id ${id} does not exists, you can't delete a phantom.` })
            }
        });
    } catch (error) {
        res.send(error);
    }
}

module.exports = UserController;