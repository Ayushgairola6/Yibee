const mongoose = require("mongoose");

const db_url = process.env.DB_URL;


main().then(() => console.log("posts connected")).catch((err) => console.error(err));
async function main() {
    await mongoose.connect(db_url)
}

const postSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    Mood: { type: String, min: 0, max: 1 },
    title: { type: String, },
    caption: { type: String },
    images: {type:String},
    CoverPhoto: { type: String },
    timeStamp: { type: Date, default: Date.now },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    likes: { type: Number, default: 0, min: [0, 'likes can not be lower than 0'] },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    hashtags: [String],
    shares: { type: Number, min: 0 },
    comments: { type: Number, min: 0 }
});

const post = mongoose.model("post", postSchema);

exports.data = { post };