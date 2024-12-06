const authController = require("../controller/authController");
const express = require("express");
const authRouter = express.Router()

authRouter.post("/signup",authController.data.Signup)
.post("/login",authController.data.Login);

exports.route = {authRouter};