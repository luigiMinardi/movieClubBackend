const { default: axios } = require('axios');
const { Movie } = require('../models/index');
const { Op } = require('sequelize');

const MovieController = {};
const key = '210d6a5dd3f16419ce349c9f1b200d6d';
const root = 'https://api.themoviedb.org/3/';
let language = 'en-US';
let page = 1;

MovieController.getSearchMovies = async (req, res) => {

    let search = req.query.q;

    try {
        let result = await axios.get(`${root}search/movie?api_key=${key}&language=${language}&query=${search}&page=${page}&include_adult=false`);
        res.send(result.data.results)
    } catch (error) {
        res.send(error);
    }
}

MovieController.getNewMovies = async (req, res) => {
    try {
        let result = await axios.get(`${root}movie/upcoming?api_key=${key}&language=${language}&page=${page}`);
        res.send(result.data);
    } catch (error) {
        res.send(error);
    }
}

MovieController.getMovieById = async (req, res) => {

    let id = req.params.pk;

    try {
        let result = await axios.get(`${root}movie/${id}?api_key=${key}&language=${language}`);
        res.send(result.data);
    } catch (error) {
        res.send(error);
    }
}

MovieController.getReviewByMovieId = async (req, res) => {

    let id = req.params.pk;

    try {
        let result = await axios.get(`${root}movie/${id}/reviews?api_key=${key}&language=${language}&page=${page}`);
        res.send(result.data);
    } catch (error) {
        res.send(error);
    }
}

MovieController.getLatestMovie = async (req, res) => {

    try {
        let result = await axios.get(`${root}movie/latest?api_key=${key}&language=${language}`);
        res.send(result.data);
    } catch (error) {
        res.send(error);
    }
}

MovieController.getTopRatedMovies = async (req, res) => {
    try {
        let result = await axios.get(`${root}movie/top_rated?api_key=${key}&language=${language}&page=${page}`);
        res.send(result.data);
    } catch (error) {
        res.send(error);
    }
}

MovieController.getSimilarMovies = async (req, res) => {

    let id = req.params.pk;

    try {
        let result = await axios.get(`${root}movie/${id}/similar?api_key=${key}&language=${language}&page=${page}`);
        res.send(result.data);
    } catch (error) {
        res.send(error);
    }
}

MovieController.getFavorites = async (req, res) => {
    // need refactor to be generic
    // create a new favorite function
    // add the generic version of the current favorite
    // function to a new endpoint (/favorites/search)
    // or add a option to query favorites
    let title = req.query.title;
    let adult = req.query.adult;
    let popularity = req.query.popularity;

    Movie.findAll({
        where: {
            [Op.and]: [
                {
                    title: {
                        [Op.like]: title
                    }
                },
                {
                    adult: {
                        [Op.like]: adult
                    }
                },
                {
                    popularity: {
                        [Op.like]: popularity
                    }
                }
            ]
        }
    }).then(movie => {

        if (movie != 0) {
            res.send(movie);
        } else {
            res.status(400).json({ msg: `You don't have favorites.` });
        };

    }).catch(error => {
        res.send(error);
    })
}

MovieController.getAdultMovies = async (req, res) => {

    Movie.findAll({
        where: {
            [Op.not]: [
                {
                    adult: {
                        [Op.like]: 0
                    }
                }
            ]
        }
    }).then(adultMovies => {
        if (adultMovies != 0) {
            res.send(adultMovies);
        } else {
            res.send("We don't have adult movies.");
        }
    }).catch(error => {
        res.send(error)
    })

}

module.exports = MovieController;