const postModel = require('../Model/postsModel')
const userModel = require('../Model/userModel')
const multer = require('multer');
const Post = postModel.data.post;
const User = userModel.user;
const jwt = require('jsonwebtoken');
const key = process.env.JWT_SECRET_KEY;



const { uploadToFirebase, deleteImage } = require('../Config/firebaseAdmin.js')


// configured multer to store media files in firebase using memory
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 1024 * 1024 * 5 } })

// function to upload file to firebase




async function getAllPosts(req, res, next) {
    try {
        const Posts = await Post.find().populate('author', 'username').lean();
        const ChangedPosts = JSON.stringify(Posts);
        // ("Sending Posts");
        return res.status(200).send(ChangedPosts);
    } catch (err) {
        (err);
        res.status(500).json({ message: "Can't fetch posts at the moment" })
    }

}

// CREATING A POST

async function createPost(req, res) {
    try {

        // RQST DATA 
        const { Mood, title, caption, hashtags } = req.body;

        const author = req.user.userId
        if (!author) {
            ("no author")
            return res.status(400).json({ message: "Author is required" })
        }
        const currentUser = await User.findById(author);
        // check if the user exists in db
        if (!currentUser) {
            return res.status(400).json("no user found");
        }
        const images = req.file;

        const imageUrl = await uploadToFirebase(images ? images : "", 'Posts')
        const newPost = new Post({ Mood, title, caption, hashtags: hashtags ? hashtags.split(" ") : [], images: imageUrl, likes: 0, shares: 0, comments: 0, author: author });

        // save the post
        await newPost.save();
        currentUser.posts.push(newPost._id);
        const postt = await Post.findById(newPost._id).populate('author', 'username')
        // save the user
        await currentUser.save();
        return res.status(201).json(postt);
    } catch (error) {
        return res.status(500).json({ message: "Please Try again", error })

    }
}

// DELETE A POST
async function DeletePost(req, res, next) {
    try {

        const userId = req.user.userId

        const id = req.params.id;
        // console.log(id)
        if (!id || typeof id !== "string") return res.status(400).json({ message: "Invalid post_id" });

        const postToDelete = await Post.findByIdAndDelete(id);
        if (!postToDelete) return res.status(404).json({ message: "Post not found" });

        if (postToDelete.images) {
            await deleteImage(postToDelete.images);
        }

        await User.findByIdAndUpdate(userId, { $pull: { posts: id } });
        return res.status(200).json({message:"Post deleted"});
    } catch (error) {
        console.error("Error in DeletePost:", error);
        return res.status(500).json({ message: "Error deleting post", error: error.message });
    }
}


// LikeUpdate/ MODIFY A POST 


async function UpdatePost(req, res, next) {

    try {
        const id = req.params.id;
        const userLiked = req.user.userId


        if (!userLiked) {
            return res.status(400).send({ message: "You are not authorized" })
        }
        if (!id) {
            return res.status(400).json({ message: "error" })
        }
        // finding the post to update
        const postToUpdate = await Post.findById(id);
        let update;
        const isLiked = postToUpdate.likedBy.includes(userLiked.userId);
        // Checking wether the post is already liked by the user

        if (isLiked) {
            ("isLiked")
            update = { $inc: { likes: -1 }, $pull: { likedBy: userLiked.userId }, new: true }

        } else {

            update = { $inc: { likes: 1 }, $addToSet: { likedBy: userLiked.userId } }
        }
        const updatedPost = await Post.findByIdAndUpdate(id, update, { new: true }).populate("author", 'username')

        if (!updatedPost) {
            return res.status(400).json({ error: "no post found" })
        }

        // updated post is also returned by the server
        await res.status(200).json(updatedPost);
    } catch (error) {
        (error)
        return res.status(400).json(error)
    }
}


exports.data = { getAllPosts, createPost, DeletePost, UpdatePost, upload };

