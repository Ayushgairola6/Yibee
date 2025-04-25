const express = require("express")
const userRouter = express.Router();
const userController = require("../controller/userController.js")
const { verifyToken } = require("../Middleware/AuthMiddleWare.js");
// setting up the routes for the music

userRouter.get("/users", verifyToken, userController.path.getAllUsers)
  .get("/data", verifyToken, userController.path.getOneUser)
  .patch('/update', verifyToken, userController.path.upload.single('ProfilePictures'), verifyToken, userController.path.UpdateUser)
  .patch('/cover', userController.path.CoverUpload.single('CoverPhotos'), verifyToken, userController.path.AddCoverPhoto)

exports.route = { userRouter };