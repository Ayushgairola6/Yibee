const express = require("express")
const postRouter = express.Router();
const auth = require("../authMiddleware");
const postController = require("../controller/postController");

postRouter.get("/posts", postController.data.getAllPosts)
//  THE USER NEEDS TO VERIFY HIMSELF WITH THE TOKEN IN ORDER TO BE ABLE TO CREATE A POST 
<<<<<<< HEAD
    .post("/newpost", auth.data.authMiddleware, postController.data.upload.single('images'), postController.data.createPost)
=======
    .post("/newpost", postController.data.upload.single('images'), postController.data.createPost)
>>>>>>> b7efff1 (fresh code)
    .delete("/post/:id", postController.data.DeletePost)
    .patch("/update/:id", postController.data.UpdatePost);

exports.Route = { postRouter };   