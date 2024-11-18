const express = require("express")
const genreRouter = express.Router();
const genreController = require('../controller/GenreController');


genreRouter.get('/genre',genreController.data.getGenres);
