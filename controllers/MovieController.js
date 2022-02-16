const { default: axios } = require('axios');

const MovieController = {};
const key = '210d6a5dd3f16419ce349c9f1b200d6d';

MovieController.getSearchMovies = async (req, res) => {
    
    let search = req.query.q;


    try {
        let result = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${key}&language=en-US&query=${search}&page=1&include_adult=false`);
        res.send(result.data.results)
    } catch (error) {
        res.send(error);
    }
}

MovieController.getNewMovies = async (req, res) => {
    try {
        let result = await axios.get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${key}&language=es-ES&page=1`);
        res.send(result.data);
    } catch (error) {
        res.send(error);
    }
}

module.exports = MovieController;