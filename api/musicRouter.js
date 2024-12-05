const express = require("express")
const musicRouter = express.Router();
const musicController = require("../controller/Musiccontroller")

// setting up the routes for the music

musicRouter.get("/songs", musicController.path.getAllSongs)
  .post('/title', musicController.path.UploadASong)
  .patch('/song', musicController.path.LikeASong)
  .delete('/title', musicController.path.DeleteASong)
  .get('/genre/:genre', musicController.path.FindSpecificSong)

exports.route = { musicRouter };