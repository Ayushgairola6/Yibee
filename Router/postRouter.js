const express = require("express")
const postRouter = express.Router();
const auth = require("../authMiddleware");
const postController = require("../controller/postController");
const { verifyToken } = require("../Middleware/AuthMiddleWare.js");

postRouter.get("/posts", postController.data.getAllPosts)


    .post("/newpost",verifyToken, postController.data.upload.single('images'), postController.data.createPost)
    .delete("/post/:id",verifyToken, postController.data.DeletePost)
    .patch("/update/:id", verifyToken,postController.data.UpdatePost);

exports.Route = { postRouter };   