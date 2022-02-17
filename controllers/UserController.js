const UserController = {};

UserController.getUser = (req, res) => {

}

UserController.postUser = (req, res) => {
    let body = req.body;

    try {
        res.send(body)
    } catch (error) {
        res.send(error);
    }
}

UserController.login = (req, res) => {

}

module.exports = UserController;