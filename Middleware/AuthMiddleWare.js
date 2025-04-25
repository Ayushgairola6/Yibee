const jwt = require("jsonwebtoken")
require('dotenv').config();

const verifyToken = (req, res, next) => {
    let token;
    const Cookietoken = req.cookies["Yibee_authToken"];
    const AuthHeaderToken = req.headers?.Authorization?.split(" ")[1];
    (req)

    if (Cookietoken) {
        token = Cookietoken;
    } else if (AuthHeaderToken) {
        token = AuthHeaderToken;
    } else if (!Cookietoken || !AuthHeaderToken) {
        return res.status(401).json({ message: "Please try logging in again!" })
    }

    (token);

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, result) => {
        if (err) {
            return;
        }
        req.user = result;
        next()
    })

};

module.exports = { verifyToken }

