const authController = require("../controller/authController");
const express = require("express");
const authRouter = express.Router()
const {verifyToken} = require("../Middleware/AuthMiddleWare.js")
authRouter.post("/signup",authController.data.Signup)
.post("/login",authController.data.Login)
.get("/authenticate",verifyToken,authController.data.UpdateState)

exports.route = {authRouter};