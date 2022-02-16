const { default: axios } = require('axios');
const cors = require('cors');
const express = require('express');
const app = express();
const router = require('./router');
const PORT = 3000;

//Middleware
app.use(express.json());
app.use(cors());

app.use(router);

app.listen(PORT, ()=>{console.log(`Server up and running at port ${PORT}`)});