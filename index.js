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
const Route1 = require(`./Router/musicRouter`);
const Route2 = require("./Router/userRouter");
const Route3 = require("./Router/authRouter");
const Route4 = require("./Router/postRouter");


const server = http.createServer(App);

// configuration of cors policy to be able to use server both on localhost and hosted frontend
const allowedOrigins = [
    'http://localhost:5173',
    'https://yibee-frontend-yibee.vercel.app',
    'https://yibee-frontend.vercel.app',
    'https://yibee-frontend-ayushgairola6-yibee.vercel.app',
    'https://yibee-frontend-jlsvqf5ri-yibee.vercel.app/'
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


App.use(cors({ origin: '*' })); 
//prefligth options
App.options('*', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(204); // No content
});

App.use(bodyParser.json());
App.use(bodyParser.urlencoded({ extented: true }));
// debugging
App.use((req, res, next) => {
    console.log(`Incoming request from origin: ${req.headers.origin}`);
    console.log(`Method: ${req.method}`);
    next();
});

App.use("/api/auth", Route3.route.authRouter);
App.use('/api/music', Route1.route.musicRouter);


App.use('/api/account', auth.data.authMiddleware, Route2.route.userRouter);
App.use("/api/feed", auth.data.authMiddleware, Route4.Route.postRouter);


App.get('/', (req, res) => {
    res.send("api is working correctly");
});

module.exports = App;

// App.listen(8080,()=>{
//     "server started";
// })