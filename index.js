const cors = require('cors');
const express = require('express');
const app = express();
const router = require('./router');
const PORT = process.env.PORT || 3000;
const db = require('./db.js');

//Middleware
app.use(express.json());
app.use(cors());

app.use(router);

db.then(() => {
    app.listen(PORT, () => console.log(`Server on port ${PORT}`)); //Conectado a la base de datos
}).catch((err) => console.log(err.message));