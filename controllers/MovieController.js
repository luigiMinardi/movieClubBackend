const { Movie } = require('../models/index');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const { default: axios } = require('axios');

const key = '210d6a5dd3f16419ce349c9f1b200d6d';
const root = 'https://api.themoviedb.org/3/';

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
            res.status(200).json({ msg: `You don't have favorites.` });
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

MovieController.putMovieById = (req, res) => {

    let data = req.body;
    let id = req.params.pk;

    try {
        if (data.title) {
            Movie.findOne({
                where: {
                    title: data.title
                }
            }).then(movie => {
                if (movie) {
                    res.status(409).json({ msg: "The movie with this title already exist" })
                } else {
                    Movie.update(data, {
                        where: { id: id }
                    }).then(() => {
                        res.status(200).json({
                            msg: `Movie with id ${id} was updated.`,
                        });
                    });
                }
            })
        } else {
            Movie.update(data, {
                where: { id: id }
            }).then(() => {
                res.status(200).json({
                    msg: `Movie with id ${id} was updated.`,
                });
            });
        }
    } catch (error) {
        res.send(error);
    }
}

MovieController.deleteMovieById = (req, res) => {

    let id = req.params.pk;

    try {
        Movie.findOne({
            where: { id: id },
        }).then(movie => {
            if (movie) {
                movie.destroy({
                    truncate: false
                });
                res.status(200).json({ msg: `Movie with id ${id} was deleted.` });
            } else {
                res.status(404).json({ msg: `Movie with id ${id} does not exists, you can't delete a phantom.` })
            }
        });
    } catch (error) {
        res.send(error);
    }
}

MovieController.deleteAllMovies = (req, res) => {
    try {
        Movie.destroy({
            where: {},
            truncate: false
        })
            .then(peliculasEliminadas => {
                res.send(`${peliculasEliminadas} has been deleted.`);
            })

    } catch (error) {
        res.send(error);
    }
}

//Random number between two limits function
const minMaxRoundedRandom = (min, max) => {
    return Math.round(Math.random() * (max - min) + min);
}

MovieController.cloneMovies = async (req, res) => {
    ///Variable para guardar el root para ver el póster
    try {
        let TMDBimgUrlRoot = "https://image.tmdb.org/t/p/w500";
        //bucle para recorrer 25 páginas de resultados. El valor de page lo saco de una función random para que no siempre muestre las mismas páginas.
        const pageNumber = 5 // !MAX = 25
        for (let j = 1; j <= pageNumber; j++) {
            let results = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${key}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${minMaxRoundedRandom(1, pageNumber)}&with_watch_monetization_types=flatrate`);
            //Saco el número de resultados por página para meterselo al siguiente bucle
            let numbOfResultsPerPageTMDB = results.data.results.length
            //Recorro cada elemento de la página para ir guardándolo acorde a los campos de mi BBDD
            for (let i = 0; i < numbOfResultsPerPageTMDB; i++) {
                //Por cada iteración creo un elemento
                Movie.create({
                    //A la izquierda mis campos de mi BBDD
                    //A la derecha los campos que devuelve TMDB
                    title: results.data.results[i].original_title,
                    description: results.data.results[i].overview,
                    adult: results.data.results[i].adult,
                    popularity: results.data.results[i].popularity,
                    image: (TMDBimgUrlRoot + "/" + results.data.results[i].poster_path)
                })
            }
        }
        res.send(`${pageNumber} pages have been clonated succesfully, with a max amount of ${500} films if 25 pages`)
    } catch (error) {
        res.status(500).json({ msg: `Something unexpected happened while cloning movieDB data.`, error: { name: error.name, message: error.message, detail: error } });
    }
};


module.exports = MovieController;