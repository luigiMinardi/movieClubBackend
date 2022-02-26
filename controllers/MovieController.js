const { Movie } = require('../models/index');
const { Op } = require('sequelize');

const MovieController = {};

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