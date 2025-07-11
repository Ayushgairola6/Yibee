const jwt = require("jsonwebtoken")
require('dotenv').config();

const verifyToken = (req, res, next) => {
    let token;
    const Cookietoken = req.cookies["Yibee_authToken"];
    const AuthHeaderToken = req.headers?.authorization?.split(" ")[1]; // Ensure 'authorization' is lowercase as headers are case-insensitive
    // console.log(req.headers, "Request Headers"); // Log headers for debugging

    if (Cookietoken) {
        token = Cookietoken;
    } else if (AuthHeaderToken) {
        token = AuthHeaderToken;
    } else if (!Cookietoken || !AuthHeaderToken) {
       
        return res.status(401).json({ message: "Please try logging in again!" })
    }

    // console.log(token, "Token"); // Log token for debugging

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, result) => {
        if (err) {
            console.error(err, "JWT Verification Error"); // Log error for debugging
            return res.status(403).json({ message: "Invalid or expired token!" }); // Return proper error response
        }
        req.user = result;
        next();
    });

};

module.exports = { verifyToken }

