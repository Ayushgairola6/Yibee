const express = require("express")
const musicRouter = express.Router();
const musicController = require("../controller/Musiccontroller")
const { verifyToken } = require("../Middleware/AuthMiddleWare.js");

// setting up the routes for the music

musicRouter.get("/songs", verifyToken, musicController.path.getAllSongs)
  .post('/title', verifyToken, musicController.path.UploadASong)
  .patch('/song', verifyToken, musicController.path.LikeASong)
  .delete('/title', verifyToken, musicController.path.DeleteASong)
  .get('/genre/:genre', verifyToken, musicController.path.FindSpecificSong)
  .get('/search/:query', verifyToken, musicController.path.Search_Song)
exports.route = { musicRouter };