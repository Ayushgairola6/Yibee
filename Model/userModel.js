const mongoose = require('mongoose');
const dotenv = require("dotenv").config();
const db_url = process.env.DB_URL;


main().then(() => console.log("userCollection connected")
).catch((err) => console.log(err));


async function main() {
    await mongoose.connect(db_url)
}

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: {
        type: String, unique: true, required: true, trim: true, lowercase: true, validate: [isEmailValid, 'invalid email']
    },
    isAdmin: { type: Boolean, default: false },
    isCreator: { type: Boolean, default: false },
    password: { type: String, required: true, },
    image: { type: String ,default:''},
    coverPhoto:{type:String,default:''},
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],
    playlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "song" }],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    About: {type: String},
})

function isEmailValid(email) {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(email)
}

const user = mongoose.model("user", userSchema);

module.exports = { user }