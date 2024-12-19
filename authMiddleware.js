const jwt = require('jsonwebtoken');
const key = process.env.JWT_SECRET_KEY;

// Verification of the user token
function authMiddleware(req, res, next) {
    // Check if the Authorization header exists
    if (!req.headers.authorization) {
        console.log("Authorization header not found");
        return res.status(403).json({ message: "No token provided" });
    }

    // Extract the token from the header
    const token = req.headers.authorization.split(" ")[1];

    // Verify the token
    jwt.verify(token, key, (err, decoded) => {
        if (err) {
            console.log("Token verification failed:", err.message);
            return res.status(401).json({ message: `Invalid token: ${err.message}` });
        }

        console.log("User is authenticated");

        // Proceed to the next middleware/route handler
        next();
    });
}

exports.data = { authMiddleware };
