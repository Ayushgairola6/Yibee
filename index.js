const express = require('express');
const App = express();
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const env = require("dotenv").config();

const auth  = require("./authMiddleware.js")

//copied below
const http = require('http');
const socketIo = require('socket.io');
//above
const bodyParser = require('body-parser');
const Route1 = require(`./Router/musicRouter`);
const Route2 = require("./Router/userRouter");
const Route3 = require("./Router/authRouter");
const Route4 = require("./Router/postRouter");


const server = http.createServer(App);



//MIDDLEWARES WITH ROUTES SETUP WITH SERVER TO SEND DATA
App.use(cors());

App.use(bodyParser.json());
App.use(bodyParser.urlencoded({ extented: true }));
App.use("/", Route3.route.authRouter);
App.use('/api', Route1.route.musicRouter);


App.use('/account', auth.data.authMiddleware, Route2.route.userRouter);
App.use("/feed", auth.data.authMiddleware, Route4.Route.postRouter);



App.listen(8080, () => {
    console.log("Server Connected");

});