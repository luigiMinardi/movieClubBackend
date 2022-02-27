const { Movie } = require('../models/index');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

const MovieController = {};

MovieController.getAllMovies = (req, res) => {
    try {
        Movie.findAll({
            where: {
                adult: {
                    [Op.notLike]: 1
                }
            }
        })
            .then(data => {
                res.status(200).json(data);
            });
    } catch (err) {
        res.send(err);
    }
}

MovieController.getMovieById = (req, res) => {
    try {
        Movie.findByPk(req.params.pk)
            .then(data => {
                let token = req.headers.authorization.split(' ')[1];
                let { user } = jwt.decode(token, authConfig.secret)
                if (data.adult && user.age >= 18) {
                    res.status(200).json(data);
                } else if (!data.adult) {
                    res.status(200).json(data);
                } else {
                    res.status(403).json({ msg: 'You need to have 18 years or more to access this movie.' })
                }
            });
    } catch (err) {
        res.send(err);
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
        let token = req.headers.authorization.split(' ')[1];
        let { user } = jwt.decode(token, authConfig.secret)
        console.log(user.age)
        if (adultMovies != 0 && user.age >= 18) {
            res.send(adultMovies);
        } else if (user.age < 18) {
            res.status(403).json({ msg: 'You need to have 18 years or more to access this zone.' })
        } else {
            res.send("We don't have adult movies.");
        }
    }).catch(error => {
        res.status(500).json({ msg: 'Something unexpected happened', error: { name: error.name, message: error.message } })
    })
}

MovieController.postNewMovie = (req, res) => {

    try {
        let title = req.body.title;
        let description = req.body.description;
        let adult = req.body.adult;
        let popularity = req.body.popularity;
        let image = req.body.image;
        let date = req.body.date;

        Movie.findOne({
            where: {
                title: title,
            }
        }).then(moviesWithSameTitle => {

            if (!moviesWithSameTitle) {

                Movie.create({
                    title: title,
                    description: description,
                    adult: adult,
                    popularity: popularity,
                    image: image,
                    date: date
                }).then(movie => {
                    res.status(201).json({ msg: `${movie.title}, created!` });
                }).catch(err => res.status(400).json({ msg: `The movie creation failed.`, error: err }));

            } else {
                res.status(400).json({ msg: `The movie with the title "${moviesWithSameTitle.title}" is already registered.` });
            }
        });

    } catch (error) {
        res.status(500).json({ msg: `Something unexpected happened while creating movie`, error: { name: error.name, message: error.message } });
    }
}

module.exports = MovieController;