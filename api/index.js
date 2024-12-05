const express = require('express');
const App = express();
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const env = require("dotenv").config();

const auth = require("./authMiddleware.js")

//copied below
const http = require('http');
const socketIo = require('socket.io');
//above
const bodyParser = require('body-parser');
const Route1 = require(`../Router/musicRouter`);
const Route2 = require("../Router/userRouter");
const Route3 = require("../Router/authRouter");
const Route4 = require("../Router/postRouter");


const server = http.createServer(App);

// configuration of cors policy to be able to use server both on localhost and hosted frontend
const allowedOrigins = [
    'http://localhost:5173',
    'https://react-yibee.vercel.app'
]


const corsOptions = {
    origin: function (origin, callback) {
        if (!origin ||
            allowedOrigins.indexOf(origin) !== -1
        ) {
            callback(null, true)
        } else {
            callback(new Error('CORS policy:Origin not allowed'), false);
        }
    },
    methods:'GET,POST,PATCH,DELETE',
    allowedHeaders:`Content-Type,Authorization`
}

//MIDDLEWARES WITH ROUTES SETUP WITH SERVER TO SEND DATA
App.use(cors(corsOptions));

App.use(bodyParser.json());
App.use(bodyParser.urlencoded({ extented: true }));
App.use("/auth", Route3.route.authRouter);
App.use('/music', Route1.route.musicRouter);


App.use('/account', auth.data.authMiddleware, Route2.route.userRouter);
App.use("/feed", auth.data.authMiddleware, Route4.Route.postRouter);


App.get('/', (req, res) => {
    res.send("api is working correctly");
});

module.exports = App;
