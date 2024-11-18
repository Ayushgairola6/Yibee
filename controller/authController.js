const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const userModel = require('../Model/userModel');
const User = userModel.user;
const key = process.env.JWT_SECRET_KEY;

// SIGNUP
async function Signup(req, res) {
    const { username, email, password } = req.body;
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({ username, email, password: hashPassword });
        if (newUser) {
            console.log(newUser);
        }
        // Save user to database
        await newUser.save();

        // Generate token
        const token = jwt.sign(
            { email: newUser.email, id: newUser._id },
            key, // Secret key for JWT
            { expiresIn: '2h' }
        );
        console.log(newUser)
        // Return the new user and token
        res.status(201).json({ newUser, token, message: "account created" });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Error creating user", error });
    }
}

// LOGIN
const Login = async (req, res, next) => {
    const { email, password } = req.body;
    console.log(email)
    console.log(password)
    try {
        const user = await User.findOne( {email});

        if (user) {
            console.log(user)
        }

        if (!user) {
            console.log("user not found in login method")
            return res.status(200).json({ message: "user not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("passoword doesnt match in login")
            return res.status(200).json({ message: "Invalid Credentials" })
        }
        const token = jwt.sign({ userId: user._id, email: user.email }, key, { expiresIn: "1h" });
        console.log(token)
        return res.status(200).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                isAdmin: user.isAdmin

            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server error" })
    }
    next()
}

function DecodeToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "no token available" })
    }

    const token = authHeader.split(' ')[1];
    try {
        const decodedToken = jwt.verify(token, key)
        req.userId = decodedToken.userId;
        console.log(decodedToken)
        next();
    } catch (err) {
        return res.status(403).json({ message: "invalid or expired token " })
    }

}
exports.data = { Signup, Login, DecodeToken };
