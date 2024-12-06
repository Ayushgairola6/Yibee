const express = require("express")
const userRouter = express.Router();
const userController = require("../controller/userController.js")

// setting up the routes for the music

  userRouter.get("/users",userController.path.getAllUsers)
  .get("/data",userController.path.getOneUser)
    .patch('/update',userController.path.upload.single('ProfilePictures'),userController.path.UpdateUser)
    .patch('/cover',userController.path.CoverUpload.single('CoverPhotos'),userController.path.AddCoverPhoto)

    exports.route= {userRouter};