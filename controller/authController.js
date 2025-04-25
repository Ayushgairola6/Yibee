const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const userModel = require('../Model/userModel');
const User = userModel.user;
const key = process.env.JWT_SECRET_KEY;
require("dotenv").config();
// SIGNUP
async function Signup(req, res, next) {
    const { username, email, password } = req.body;
    try {

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are mandatory" })
        }
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({ username, email, password: hashPassword });

        if (!newUser) {
            ('fields cant be empty')
        }
        // Save user to database
        await newUser.save();

        // Generate token
        const token = jwt.sign(
            { email: newUser.email, id: newUser._id },
            key, // Secret key for JWT
            { expiresIn: '2h' }
        );

        // Return the new user and token
        return res.status(201).json({ newUser, token, message: "account created" });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Error creating user", error });
    }
}

// LOGIN
const Login = async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are mandatory" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid Password!" });
        }

        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

        res.cookie('Yibee_authToken', token, {
            httpOnly: true,  // Prevent XSS attacks
            secure: process.env.NODE_ENV === "production",  // Enable only in HTTPS environments
            maxAge: 3600000
        });

        return res.json({ token });

    } catch (error) {
        (error)
        res.status(500).json({ message: "Server error" })
    }
}

function UpdateState(req, res) {

    try {
        ("yha the code phoch gaya", req.user)

        if (!req.user) {
            return res.status(400).json({ message: "Unauthorized" })
        } else {
            return res.json({ message: "Authorized" });
        }

    } catch (err) {
        return res.status(403).json({ message: "invalid or expired token " })
    }

}
exports.data = { Signup, Login, UpdateState };
