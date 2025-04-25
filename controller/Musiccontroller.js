const jwt = require('jsonwebtoken')
const songModel = require('../Model/musicModel.js')
const SONG = songModel.song;
const userModel = require('../Model/userModel.js')
const User = userModel.user

const getAllSongs = async (req, res, next) => {
  try {
    const songs = await SONG.aggregate([{ $sample: { size: 1 } }]);
    // ('sending songs', songs )
    res.setHeader("Content-Type", 'application/json')
    res.json(songs)
  } catch (err) {
    (err)
    res.status(500).json({ message: err.message })

  }
  next();
}


function getOneSong(req, res, next) {
  res.setHeader("Content-Type", 'text/html');
  res.send("get one");
  next()
}


function UploadASong(req, res, next) {
  const Song = new songModel.song({
    title: 'knull2',
    artist: ' ayush ',
    album: 'sad ',
    genre: ' phonk',
    release_date: '2023-06-30',
    duration: '04:30',
    play_count: 123000,
    rating: 4.9,
    url: 'null2',
    thumbnail: 'yy2'
  })
  Song.save()
  res.json(Song);
  next()
}

async function LikeASong(req, res, next) {
  try {

    const id = req.user.userId;
    const song = req.body;

    const search = await User.findById(id);
    const isAdded = search.playlist.includes(song._id);
    if (isAdded) {
      return res.status(200).json({ res: "song is already added" })
    }
    if (!song) {
      return res.status(200).json({ message: "no song found" });
    }

    const user = await User.findByIdAndUpdate(id, { $addToSet: { playlist: song } }, { new: true });
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    const updatedUser = await User.findById(id).populate('playlist');
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error });
  }


}

async function FindSpecificSong(req, res) {
  try {
    const song = await SONG.find({ genre: req.params.genre });


    if (!song) {
      ("this category doesn't exist");
      return res.status(401).json({ message: "this category doesn't exist" });
    }
    else {
      (song)
      return res.status(200).json(song);
    }
    ('this was causing the error')
  } catch (error) {
    (error)
    return res.status(500).json(error);
  }
}

// search music asked by user

async function Search_Song(req, res) {
  try {
    const search_Query = req.params.query;


    if (!search_Query || typeof search_Query !== "string") {
      return res.status(400).json("invalid rqst")
    }
    // find the song
    const song = await SONG.find({ title: search_Query.toUpperCase() });


    if (!song) {
      ("this song doesn't exist");
      return res.status(401).json({ message: "this category doesn't exist" });
    }
    return res.json(song)

  } catch (error) {
    (error)
    return res.status(500).json(error);
  }
}


function DeleteASong(req, res, next) {
  res.setHeader("Content-Type", 'text/html');
  res.send("delete");
  next()
}

exports.path = { getAllSongs, getOneSong, UploadASong, LikeASong, DeleteASong, FindSpecificSong, Search_Song }