const { default: axios } = require('axios');
const MovieDBController = {};

const key = '210d6a5dd3f16419ce349c9f1b200d6d';
const root = 'https://api.themoviedb.org/3/';
let language = 'en-US';
let page = 1;

MovieDBController.getSearchMovies = async (req, res) => {

    let search = req.query.q;

    try {
        let result = await axios.get(`${root}search/movie?api_key=${key}&language=${language}&query=${search}&page=${page}&include_adult=false`);
        res.send(result.data.results)
    } catch (error) {
        res.send(error);
    }
}

MovieDBController.getNewMovies = async (req, res) => {
    try {
        let result = await axios.get(`${root}movie/upcoming?api_key=${key}&language=${language}&page=${page}`);
        res.send(result.data);
    } catch (error) {
        res.send(error);
    }
}

MovieDBController.getMovieById = async (req, res) => {

    let id = req.params.pk;

    try {
        let result = await axios.get(`${root}movie/${id}?api_key=${key}&language=${language}`);
        res.send(result.data);
    } catch (error) {
        res.send(error);
    }
}

MovieDBController.getReviewByMovieId = async (req, res) => {

    let id = req.params.pk;

    try {
        let result = await axios.get(`${root}movie/${id}/reviews?api_key=${key}&language=${language}&page=${page}`);
        res.send(result.data);
    } catch (error) {
        res.send(error);
    }
}

MovieDBController.getLatestMovie = async (req, res) => {

    try {
        let result = await axios.get(`${root}movie/latest?api_key=${key}&language=${language}`);
        res.send(result.data);
    } catch (error) {
        res.send(error);
    }
}

MovieDBController.getTopRatedMovies = async (req, res) => {
    try {
        let result = await axios.get(`${root}movie/top_rated?api_key=${key}&language=${language}&page=${page}`);
        res.send(result.data);
    } catch (error) {
        res.send(error);
    }
}

MovieDBController.getSimilarMovies = async (req, res) => {

    let id = req.params.pk;

    try {
        let result = await axios.get(`${root}movie/${id}/similar?api_key=${key}&language=${language}&page=${page}`);
        res.send(result.data);
    } catch (error) {
        res.send(error);
    }
}

module.exports = MovieDBController;