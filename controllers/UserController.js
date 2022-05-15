const { User } = require('../models/index');
const bcrypt = require('bcrypt');
const authConfig = require('../config/auth');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

class UserMethods {
    constructor() {}

    async postNewUser(enrollment) {
        const newUser = User.findAll({
            where: {
                [Op.or]: [
                    {
                        email: {
                            [Op.like]: enrollment.email,
                        },
                    },
                    {
                        nickname: {
                            [Op.like]: enrollment.nickname,
                        },
                    },
                ],
            },
        })
            .then((usersWithSameEmailOrNickname) => {
                if (usersWithSameEmailOrNickname == 0) {
                    return User.create(enrollment)
                        .then((user) => {
                            return {
                                status: 201,
                                data: {
                                    msg: `${user.name}, welcome!`,
                                    user: user,
                                },
                            };
                        })
                        .catch((err) => {
                            return {
                                status: 400,
                                data: {
                                    msg: `Something unexpected happened while creating user`,
                                    error: {
                                        name: err.name,
                                        message: err.message,
                                        detail: err,
                                    },
                                },
                            };
                        });
                } else {
                    console.log(usersWithSameEmailOrNickname);
                    return {
                        status: 200,
                        data: {
                            msg: 'The user with this email or nickname is already registered.',
                        },
                    };
                }
            })
            .catch((error) => {
                return {
                    status: 422,
                    data: {
                        msg: `Something unexpected happened while getting user data.`,
                        error: {
                            name: error.name,
                            message: error.message,
                            detail: error,
                        },
                    },
                };
            });
        return newUser;
    }

    async postLogin(email, password) {
        const user = User.findOne({
            where: { email: email },
        })
            .then((user) => {
                if (!user) {
                    return {
                        status: 401,
                        data: {
                            msg: 'Invalid user or password.',
                        },
                    };
                } else {
                    if (bcrypt.compareSync(password, user.password)) {
                        let token = jwt.sign(
                            { user: user },
                            authConfig.secret,
                            {
                                expiresIn: authConfig.expires,
                            }
                        );
                        return {
                            status: 200,
                            data: {
                                user: user,
                                token: token,
                            },
                        };
                    } else {
                        return {
                            status: 401,
                            data: {
                                msg: 'Invalid user or password.',
                            },
                        };
                    }
                }
            })
            .catch((error) => {
                return {
                    status: 422,
                    data: {
                        msg: `Something unexpected happened while logging user.`,
                        error: {
                            name: error.name,
                            message: error.message,
                            detail: error,
                        },
                    },
                };
            });
        return user;
    }

    async postFindUserByMail(email) {
        const user = User.findOne({ where: { email: email } })
            .then((data) => {
                if (data) {
                    return { status: 200, data: data };
                } else {
                    return {
                        status: 404,
                        data: {
                            error: {
                                name: 'NotFound',
                                message: 'User not found',
                            },
                        },
                    };
                }
            })
            .catch((error) => {
                return {
                    status: 422,
                    data: {
                        msg: 'Something unexpected happened while getting user by mail.',
                        error: {
                            name: error.name,
                            message: error.message,
                            detail: error,
                        },
                    },
                };
            });
        return user;
    }

    async getAllUsers() {
        const users = await User.findAll()
            .then((data) => {
                return { status: 200, data: data };
            })
            .catch((error) => {
                return {
                    status: 422,
                    data: {
                        msg: `Something unexpected happened while getting users.`,
                        error: {
                            name: error.name,
                            message: error.message,
                            detail: error,
                        },
                    },
                };
            });
        return users;
    }

    async getUserByPk(pk) {
        const user = await User.findByPk(pk)
            .then((data) => {
                if (data) {
                    return { status: 200, data: data };
                } else {
                    return {
                        status: 404,
                        data: {
                            error: {
                                name: 'NotFound',
                                message: 'User not found',
                            },
                        },
                    };
                }
            })
            .catch((error) => {
                return {
                    status: 422,
                    data: {
                        msg: `Something unexpected happened while getting user.`,
                        error: {
                            name: error.name,
                            message: error.message,
                            detail: error,
                        },
                    },
                };
            });
        return user;
    }

    async putUserByPk(data, pk) {
        if (Object.values(data).every((value) => value === undefined)) {
            return {
                status: 400,
                data: {
                    error: {
                        name: 'BadRequest',
                        message: 'No data provided',
                    },
                },
            };
        }

        const user = User.findByPk(pk)
            .then((user) => {
                if (!user) {
                    return {
                        status: 404,
                        data: {
                            error: {
                                name: 'NotFound',
                                message: 'User not found',
                            },
                        },
                    };
                } else {
                    return user
                        .update(data, {
                            where: { id: pk },
                        })
                        .then((updatedUser) => {
                            return {
                                status: 200,
                                data: {
                                    msg: `User with pk ${pk} was updated.`,
                                    user: updatedUser,
                                },
                            };
                        })
                        .catch((error) => {
                            return {
                                status: 422,
                                data: {
                                    msg: `Something unexpected happened while updating user data.`,
                                    error: {
                                        name: error.name,
                                        message: error.message,
                                        detail: error,
                                    },
                                },
                            };
                        });
                }
            })
            .catch((error) => {
                return {
                    status: 400,
                    data: {
                        msg: `Something unexpected happened while updating user data.`,
                        error: {
                            name: error.name,
                            message: error.message,
                            detail: error,
                        },
                    },
                };
            });
        return user;
    }

    async putNewPassword(pk, oldPassword, newPassword) {
        const user = User.findByPk(pk)
            .then((userFound) => {
                if (userFound) {
                    if (bcrypt.compareSync(oldPassword, userFound.password)) {
                        newPassword = bcrypt.hashSync(
                            newPassword,
                            Number.parseInt(authConfig.rounds)
                        );
                        let data = {
                            password: newPassword,
                        };
                        return userFound
                            .update(data, {})
                            .then((updatedUser) => {
                                let token = jwt.sign(
                                    { user: updatedUser },
                                    authConfig.secret,
                                    {
                                        expiresIn: authConfig.expires,
                                    }
                                );
                                return {
                                    status: 200,
                                    data: {
                                        msg: `Password from ${userFound.name} was updated.`,
                                        user: updatedUser,
                                        token: token,
                                    },
                                };
                            })
                            .catch((error) => {
                                return {
                                    status: 400,
                                    data: {
                                        msg: `Some error happened while updating the password.`,
                                        error: {
                                            name: error.name,
                                            message: error.message,
                                            detail: error,
                                        },
                                    },
                                };
                            });
                    } else {
                        return {
                            status: 401,
                            data: {
                                msg: 'Invalid user or password.',
                            },
                        };
                    }
                } else {
                    return {
                        status: 404,
                        data: {
                            error: {
                                name: 'NotFound',
                                message: 'User not found',
                            },
                        },
                    };
                }
            })
            .catch((error) => {
                return {
                    status: 422,
                    data: {
                        msg: `Something unexpected happened while updating user password.`,
                        error: {
                            name: error.name,
                            message: error.message,
                            detail: error,
                        },
                    },
                };
            });
        return user;
    }

    async deleteUserByPk(pk) {
        const user = User.findByPk(pk)
            .then((user) => {
                if (user) {
                    return user
                        .destroy({
                            truncate: false,
                        })
                        .then(() => {
                            return {
                                status: 200,
                                data: {
                                    msg: `User with id ${pk} was deleted.`,
                                },
                            };
                        })
                        .catch((error) => {
                            return {
                                status: 400,
                                data: {
                                    msg: `Something unexpected happened while deleting user.`,
                                    error: {
                                        name: error.name,
                                        message: error.message,
                                        detail: error,
                                    },
                                },
                            };
                        });
                } else {
                    return {
                        status: 404,
                        data: {
                            error: {
                                name: 'NotFound',
                                message: `User with id ${pk} does not exists, you can't delete a phantom.`,
                            },
                        },
                    };
                }
            })
            .catch((error) => {
                return {
                    status: 422,
                    data: {
                        msg: `Something unexpected happened while deleting user.`,
                        error: {
                            name: error.name,
                            message: error.message,
                            detail: error,
                        },
                    },
                };
            });
        return user;
    }
}

const UserController = new UserMethods();
module.exports = UserController;
