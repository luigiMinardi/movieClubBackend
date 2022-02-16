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
    console.log(req)
    try {
        let result = await axios.get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${key}&language=en-US&page=1`);
        res.send(result.data);
    } catch (error) {
        res.send(error);
    }
}

MovieController.getMovieById = async (req, res) => {

    let id = req.params.pk;

    try {
        let result = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${key}&language=en-US`);
        res.send(result.data);
    } catch (error) {
        res.send(error);
    }
}

MovieController.getReviewByMovieId = async (req, res) => {

    let id = req.params.pk;

    try {
        let result = await axios.get(`https://api.themoviedb.org/3/movie/${id}/reviews?api_key=${key}&language=en-US&page=1`);
        res.send(result.data);
    } catch (error) {
        res.send(error);
    }
}

MovieController.getLatestMovie = async (req, res) => {

    try {
        let result = await axios.get(`https://api.themoviedb.org/3/movie/latest?api_key=${key}&language=en-US`);
        res.send(result.data);
    } catch (error) {
        res.send(error);
    }
}

MovieController.getBestMovies = async (req, res) => {
    console.log(req)
    console.log("hello method")
    try {
        console.log("hello try")
        let result = await axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${key}&language=en-US&page=1`);
        res.send(result.data);
    } catch (error) {
        console.log("hello error")
        res.send(error);
    }
}

MovieController.getSimilarMovies = async (req, res) => {

    let id = req.params.pk;

    try {
        let result = await axios.get(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=${key}&language=en-US&page=1`);
        res.send(result.data);
    } catch (error) {
        res.send(error);
    }
}

module.exports = MovieController;