const express = require('express');
const App = express();
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const env = require("dotenv").config();
require("dotenv").config();
const cookies = require("cookie-parser")
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
    'https://yibee-frontend-jlsvqf5ri-yibee.vercel.app'
];

// CORS options
const corsOptions = {
    origin:allowedOrigins ,
    methods: 'GET,POST,PATCH,DELETE,PUT,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true
};


App.use(cors(corsOptions)); 
//prefligth options

App.use(cookies());
App.use(bodyParser.json());
App.use(bodyParser.urlencoded({ extented: true }));
// debugging


App.use("/api/auth", Route3.route.authRouter);
App.use('/api/music', Route1.route.musicRouter);


App.use('/api/account', Route2.route.userRouter);
App.use("/api/feed", Route4.Route.postRouter);
// App.post("/api/authenticate",auth.data.authMiddleware)

App.get('/', (req, res) => {
    res.send("api is working correctly");
});

// module.exports = App;

App.listen(process.env.PORT,()=>{
   console.log( "server started");
})