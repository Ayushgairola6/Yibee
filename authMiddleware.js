const jwt = require('jsonwebtoken');
<<<<<<< HEAD

function authMiddleware(req, res, next) {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }
    jwt.verify(token, 'shhh', (err, decoded) => {
=======
const key = process.env.JWT_SECRET_KEY;
function authMiddleware(req, res, next) {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }
    jwt.verify(token, key, (err, decoded) => {
>>>>>>> b7efff1 (fresh code)
        if (err) {
            console.log(err)
            return res.status(401).json({ message: `Invalid token ${err}` });
        }
        req.user = decoded;  // You can access the user's info later using req.user
        next();
    });
}

exports.data = { authMiddleware };