const mongoose = require('mongoose');
const db_url = process.env.DB_URL;


main().then(() => console.log("GenreCollection connected")
).catch((err) => console.log(err));


async function main() {
    await mongoose.connect(db_url)
}

const genreSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    artist: { type: String, required: true },
    album: String,
    genre: String,
    release_date: String,
    duration: { type: Number, required: true },
    play_count: Number,
    rating: Number,
    url: { type: String, required: true, unique: true },
    thumbnail: { type: String, unique: true }
})

const genre = mongoose.model("genre", genreSchema);

module.exports = { genre }