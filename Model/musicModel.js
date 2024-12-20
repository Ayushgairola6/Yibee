const mongoose = require('mongoose');
const db_url = process.env.DB_URL;
const dotenv = require("dotenv").config();
main().then(() => console.log("musicCollection connected")
).catch((err) => console.log(err));


async function main() {
    await mongoose.connect(db_url)
}

const musicSchema = new mongoose.Schema({
    title: { type: String, required: true,  },
    artist: { type: String, required: true },
    album: {type:String},
    genre: {type:String},
    category:{type:String},
    release_date: String,
    duration: { type: Number, required: true },
    play_count: Number,
    rating: Number,
    url: { type: String, required: true, unique: true },
    thumbnail: { type: String, unique: true }
})

const song = mongoose.model("song", musicSchema);

module.exports = { song }