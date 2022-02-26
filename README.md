# movieClubBackend

## Endpoints

### movies-db

GET    http://localhost:3000/movies-db/search
GET    http://localhost:3000/movies-db/new
GET    http://localhost:3000/movies-db/5
GET    http://localhost:3000/movies-db/59/reviews
GET    http://localhost:3000/movies-db/bests
GET    http://localhost:3000/movies-db/late
GET    http://localhost:3000/movies-db/similar-to/59

### movies

GET    http://localhost:3000/movies/favorites
GET    http://localhost:3000/movies/adult

### orders

GET    http://localhost:3000/orders/
POST   http://localhost:3000/orders/

### users

POST   http://localhost:3000/users
POST   http://localhost:3000/users/login
POST   http://localhost:3000/users/email
GET    http://localhost:3000/users
GET    http://localhost:3000/users/1
PUT    http://localhost:3000/users/1
PUT    http://localhost:3000/users/5/update-password
DELETE http://localhost:3000/users/4

