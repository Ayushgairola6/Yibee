const jwt = require('jsonwebtoken')
const songModel = require('../Model/musicModel.js')
const SONG = songModel.song;
const userModel = require('../Model/userModel.js')
const User = userModel.user
const getAllSongs = async (req, res, next) => {
  try {
    const songs = await SONG.aggregate([{ $sample: { size: 1 } }]);
    // console.log('sending songs', songs )
    res.setHeader("Content-Type", 'application/json')
    res.json(songs)
  } catch (err) {
    console.log(err)
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
  const song = req.body;
  console.log(song)
  const token = req.headers.authorization.split(' ')[1];
  try {
    const decodedToken = jwt.decode(token);
    const id = decodedToken.userId;

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
    console.log(user);
  } catch (error) {
    res.status(500).json({ message: error });
  }


}

async function FindSpecificSong(req, res) {
  try {
    const song = await SONG.find({ genre: req.params.genre });
    if (!song) {
      console.log("this category doesn't exist");
      return res.status(401).json({message:"this category doesn't exist"});
    }
    else {
      console.log(song)
      return res.status(200).json(song);
    }
console.log('this was causing the error')
  } catch (error) {
    console.log(error)
    return res.status(500).json(error);
  }
}


function DeleteASong(req, res, next) {
  res.setHeader("Content-Type", 'text/html');
  res.send("delete");
  next()
}

exports.path = { getAllSongs, getOneSong, UploadASong, LikeASong, DeleteASong, FindSpecificSong }