const axios = require('axios');

const MovieController = {};

MovieController.getSearchMovie = async (req, res) => {
    try {
        //let result = await axios.get('')
        // req.send(result)
        req.send(console.log('test'));
    } catch (error) {
        res.send(error);
    }
}

module.exports = MovieController;