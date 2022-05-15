const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');
const bcrypt = require('bcrypt');
const authConfig = require('../config/auth');
const jwt = require('jsonwebtoken');

const UserController = require('../controllers/UserController');

router.post('/', async (req, res) => {
    try {
        let name = req.body.name;
        let surname = req.body.surname;
        let nickname = req.body.nickname;
        let age = req.body.age;
        let email = req.body.email;
        if (!req.body.password) {
            let error = new Error('You need to pass a password.');
            error.name = 'Missing Password';
            throw error;
        }
        let password = bcrypt.hashSync(
            req.body.password,
            Number.parseInt(authConfig.rounds)
        );
        let isAdmin = req.body.isAdmin || false;

        const response = await UserController.postNewUser({
            name,
            surname,
            nickname,
            age,
            email,
            password,
            isAdmin,
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        return res.status(500).json({
            msg: `Something unexpected happened on our side, please report to us and we will try our best to fix.`,
            error: {
                name: error.name,
                message: error.message,
                detail: error,
            },
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        let email = req.body.email;
        let password = req.body.password;

        const response = await UserController.postLogin(email, password);
        res.status(response.status).json(response.data);
    } catch (error) {
        return res.status(500).json({
            msg: `Something unexpected happened on our side, please report to us and we will try our best to fix.`,
            error: {
                name: error.name,
                message: error.message,
                detail: error,
            },
        });
    }
});

router.post('/email', auth, async (req, res) => {
    try {
        let email = req.body.email;

        const response = await UserController.postFindUserByMail(email);
        res.status(response.status).json(response.data);
    } catch (error) {
        return res.status(500).json({
            msg: `Something unexpected happened on our side, please report to us and we will try our best to fix.`,
            error: {
                name: error.name,
                message: error.message,
                detail: error,
            },
        });
    }
});

router.get('/', auth, isAdmin, async (req, res) => {
    try {
        const response = await UserController.getAllUsers();
        res.status(response.status).json(response.data);
    } catch (error) {
        return res.status(500).json({
            msg: `Something unexpected happened on our side, please report to us and we will try our best to fix.`,
            error: {
                name: error.name,
                message: error.message,
                detail: error,
            },
        });
    }
});

router.get('/:pk', auth, async (req, res) => {
    try {
        const response = await UserController.getUserByPk(req.params.pk);
        res.status(response.status).json(response.data);
    } catch (error) {
        return res.status(500).json({
            msg: `Something unexpected happened on our side, please report to us and we will try our best to fix.`,
            error: {
                name: error.name,
                message: error.message,
                detail: error,
            },
        });
    }
});

router.put('/:pk', auth, async (req, res) => {
    try {
        let pk = req.params.pk;
        // pick the token
        let token = req.headers.authorization.split(' ')[1];
        // pick the user logged
        let { user } = jwt.decode(token, authConfig.secret);
        // check if the user is the same that is trying to update the password
        if (user.id != pk) {
            let error = new Error('You are not allowed to do this.');
            error.name = 'Unauthorized';
            throw error;
        }
        let name = req.body.name;
        let surname = req.body.surname;
        let nickname = req.body.nickname;
        let age = req.body.age;
        let email = req.body.email;
        let data = {
            name: name || undefined,
            surname: surname || undefined,
            nickname: nickname || undefined,
            age: age || undefined,
            email: email || undefined,
        };

        const response = await UserController.putUserByPk(data, pk);
        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.name === 'Unauthorized') {
            return res.status(401).json({
                msg: `You can't change things that aren't yours.`,
                error: {
                    name: error.name,
                    message: error.message,
                    detail: {},
                },
            });
        }
        return res.status(500).json({
            msg: `Something unexpected happened on our side, please report to us and we will try our best to fix.`,
            error: {
                name: error.name,
                message: error.message,
                detail: error,
            },
        });
    }
});

router.put('/:pk/update-password', auth, async (req, res) => {
    try {
        let pk = req.params.pk;
        // pick the token
        let token = req.headers.authorization.split(' ')[1];
        // pick the user logged
        let { user } = jwt.decode(token, authConfig.secret);
        // check if the user is the same that is trying to update the password
        if (user.id != pk) {
            let error = new Error('You are not allowed to do this.');
            error.name = 'Unauthorized';
            throw error;
        }
        let oldPassword = req.body.oldPassword;
        let newPassword = req.body.newPassword;

        const response = await UserController.putNewPassword(
            pk,
            oldPassword,
            newPassword
        );
        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.name === 'Unauthorized') {
            return res.status(401).json({
                msg: `You can't change things that aren't yours.`,
                error: {
                    name: error.name,
                    message: error.message,
                    detail: {},
                },
            });
        }
        return res.status(500).json({
            msg: `Something unexpected happened on our side, please report to us and we will try our best to fix.`,
            error: {
                name: error.name,
                message: error.message,
                detail: error,
            },
        });
    }
});

router.delete('/:pk', auth, async (req, res) => {
    try {
        let pk = req.params.pk;

        // pick the token
        let token = req.headers.authorization.split(' ')[1];
        // pick the user logged
        let { user } = jwt.decode(token, authConfig.secret);
        // check if the user is the same that is trying to update the password
        if (user.id != pk && !user.isAdmin) {
            let error = new Error('You are not allowed to do this.');
            error.name = 'Unauthorized';
            throw error;
        }

        const response = await UserController.deleteUserByPk(pk);
        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.name === 'Unauthorized') {
            return res.status(401).json({
                msg: `You can't change things that aren't yours.`,
                error: {
                    name: error.name,
                    message: error.message,
                    detail: {},
                },
            });
        }
        return res.status(500).json({
            msg: `Something unexpected happened on our side, please report to us and we will try our best to fix.`,
            error: {
                name: error.name,
                message: error.message,
                detail: error,
            },
        });
    }
});

module.exports = router;
