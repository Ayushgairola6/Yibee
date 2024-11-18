const express = require("express");
const usermodel = require('../Model/userModel.js')
const User = usermodel.user;
const jwt = require("jsonwebtoken");
const multer = require('multer');
const key = process.env.JWT_SECRET_KEY;

const { uploadToFirebase, deleteImage } = require('../Config/firebaseAdmin.js')

// upload for profilePics
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 1024 * 1024 * 5 } })
// upload for coverPhotos
const CoverUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 1024 * 1024 * 5 } })


const getAllUsers = async (req, res, next) => {
  try {
    const users = await usermodel.user.find().lean();
    res.send((users));;
    next()
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message });

  }
}

async function getOneUser(req, res) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {

      res.status(400).json(error)
    }
    const decoded = await jwt.decode(token);
    const id = decoded.userId;
    if (!id) {
      return res.status(401).json({ message: "User not found" })
    }
    const CurrentUser = await User.findById(id).populate('posts').populate('playlist').lean();
    return res.status(200).json(CurrentUser);
  } catch (error) {
    console.log(error)
    return res.status(400).json(error)
  }
}


// UPDATING THE DETAILS OF A USER /
async function UpdateUser(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      console.log('no token');
      return res.status(401).send('No token found')
    }
    const decoded = await jwt.decode(token);
    const id = decoded.userId;
    if (!id) {
      console.log('User not found')
      return res.status(200).json({ message: "User not found" })
    }

    const image = req.file ;
    const user = await User.findById(id);
    
    if (user.image !== "") {
      await deleteImage(user.image, 'ProfilePictures')
    }
    const imageUrl = await uploadToFirebase(image?image:"", 'ProfilePictures')

    const CurrentUser = await User.findByIdAndUpdate(id, { image: imageUrl });
  

    await res.status(200).json(CurrentUser);
  } catch (error) {
    console.log(error)
    return res.status(400).json(error)
  }
}

async function AddCoverPhoto(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      console.log('no token');
      return res.status(401).send('No account found')
    }
    const decoded = await jwt.decode(token);
    const id = decoded.userId;
    if (!id) {
      console.log('User not found')
      return res.status(200).json({ message: "User not found" })
    }


    const Cover = req.file 
   if(!Cover){
    console.log('no image')
    return res.status(400).send('no image found')
   }

     const user = await User.findById(id);
    if (user.coverPhoto !== "") {
      await deleteImage(user.coverPhoto, 'CoverPhotos')
    }
    const imageUrl = await uploadToFirebase(Cover?Cover:"", "CoverPhotos");

    const UpdatedUser = await User.findByIdAndUpdate(id, { coverPhoto: imageUrl });
    await res.status(200).json(UpdatedUser);
  } catch (error) {
    console.log(error)
    return res.status(400).json(error)
  }
}


exports.path = { getAllUsers, getOneUser, UpdateUser, AddCoverPhoto, upload, CoverUpload };


