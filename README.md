# movieClubBackend

## Installing

* First clone the repository:

    ```bash
    git clone https://github.com/luigiMinardi/movieClubBackend
    ```
    
    enter in the cloned repo `cd movieClubBackend` or open in your IDE, for example `code movieClubBackend` if you're using VSC.

* Install all the dependencies:

    NPM
    ```bash
    npm i
    ```
    Yarn
    ```bash
    yarn
    ```

* At `config/config.json` change:

    ```json
    "development": {
        ...,
        "password": "1234",
        "database": "movieClub",
        ...
    }
    ```

    To
    
    ```json
    "development": {
        ...,
        "password": "your_root_password",
        "database": "yourDatabaseName",
        ...
    }
    ```

* Create the data base:

    <span style="color:red">You need to have mysql installed and running on your computer for this to work</span>. At the first time you may need to create the db directly on mysql (or your UI to use it (like Mysql Workbench)) since sometimes the `sequelize db:create` bugs, but after creating it will work fine so whenever you drop your db you can reacreate by the command instead of manually.

    NPM
    ```bash
    npx sequelize db:create
    ```
    Yarn
    ```bash
    yarn sequelize db:create
    ```

* Make the migrations:

    NPM
    ```bash
    npx sequelize db:migrate
    ```
    Yarn
    ```bash
    yarn sequelize db:migrate
    ```

* Run the server:

    NPM
    ```bash
    npm run dev
    ```
    Yarn
    ```bash
    yarn nodemon
    ```

Now you are ready to use it.

# Using the API

## Data Base draw



## Endpoints

### movies-db

GET    http://localhost:3000/movie-db/search

GET    http://localhost:3000/movie-db/new

GET    http://localhost:3000/movie-db/5

GET    http://localhost:3000/movie-db/59/reviews

GET    http://localhost:3000/movie-db/bests

GET    http://localhost:3000/movie-db/late

GET    http://localhost:3000/movie-db/similar-to/59

### movies

POST   http://localhost:3000/movies

GET    http://localhost:3000/movies/favorites

GET    http://localhost:3000/movies/adult

GET    http://localhost:3000/movies

GET    http://localhost:3000/movies/1

PUT    http://localhost:3000/movies/1

DELETE http://localhost:3000/movies/1

### orders

POST   http://localhost:3000/orders

GET    http://localhost:3000/orders

GET    http://localhost:3000/orders/1

GET    http://localhost:3000/orders/top-rated

DELETE http://localhost:3000/orders/1

### users

POST   http://localhost:3000/users

POST   http://localhost:3000/users/login

POST   http://localhost:3000/users/email

GET    http://localhost:3000/users

GET    http://localhost:3000/users/1

PUT    http://localhost:3000/users/1

PUT    http://localhost:3000/users/1/update-password

DELETE http://localhost:3000/users/2

