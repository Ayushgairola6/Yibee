const express = require("express");
const usermodel = require('../Model/userModel.js')
const User = usermodel.user;
const jwt = require("jsonwebtoken");
const multer = require('multer');
const key = process.env.JWT_SECRET_KEY;

const { uploadToFirebase, deleteImage } = require('../Config/firebaseAdmin.js')

// upload for profilePics
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 1024 * 1024 * 10 } })
// upload for coverPhotos
// const CoverUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 1024 * 1024 * 10 } })


const getAllUsers = async (req, res, next) => {
  try {
    const users = await usermodel.user.find().lean();
    res.send((users));;
    next()
  } catch(error){
    console.log(error);
    return res.status(500).json({message:"Internal Server Error"})
  }
}

async function getOneUser(req, res) {
  try {
    const id = req.user.userId
    if (!id) {
      return res.status(401).json({ message: "User not found" })
    }
    const CurrentUser = await User.findById(id).populate('posts').populate('playlist').lean();
    return res.status(200).json(CurrentUser);
  } catch(error){
    console.log(error);
    return res.status(500).json({message:"Internal Server Error"})
  }
}


// UPDATING THE DETAILS OF A USER /
// async function UpdateUser(req, res, next) {
//   try {
//     const id = req.user.userId

//     if (!id) {
//       ('User not found')
//       return res.status(200).json({ message: "User not found" })
//     }

//     const image = req.file;
//     const user = await User.findById(id);

//     if (user.image.startsWith("lemon-1ef21.appspot.com")) {
//       await deleteImage(user.image, 'ProfilePictures')
//     }
//     const imageUrl = await uploadToFirebase(image ? image : "", 'ProfilePictures')
//     if (!imageUrl) {
//       return res.status(400).json({ message: "Please try again later" });
//     }
//     const CurrentUser = await User.findByIdAndUpdate(id, { image: imageUrl });

//     if(!CurrentUser)return res.status(404).json({message:"User not found"});

//     await res.status(200).json({message:"done"});
//   } catch(error){
//     console.log(error);
//     return res.status(500).json({message:"Internal Server Error"})
//   }
// }
async function UpdateUser(req, res) {
  try {
    const id = req.user.userId
    // console.log(req.body);
    console.log(req.file)
   
    if (!id) {
      ('User not found')
      return res.status(200).json({ message: "User not found" })
    }

    const image = req.file;
    

    await res.status(200).json({message:"done"});
  } catch(error){
    console.log(error);
    return res.status(500).json({message:"Internal Server Error"})
  }
}

async function AddCoverPhoto(req, res, next) {
  try {
    const id = req.user.userId
    if (!id) {
      ('User not found')
      return res.status(200).json({ message: "User not found" })
    }


    const Cover = req.file
    if (!Cover) {
      ('no image')
      return res.status(400).send('no image found')
    }

    const user = await User.findById(id);
    if (user.coverPhoto !== "") {
      await deleteImage(user.coverPhoto, 'CoverPhotos')
    }
    const imageUrl = await uploadToFirebase(Cover ? Cover : "", "CoverPhotos");
    if (!imageUrl) {
      return res.status(400).json({ message: "Please try again later" });
    }
    const UpdatedUser = await User.findByIdAndUpdate(id, { coverPhoto: imageUrl });
    if(!UpdatedUser)return res.status(404).json({message:"User not found"});

    await res.status(200).json({message:"done"});
  } catch(error){
    console.log(error);
    return res.status(500).json({message:"Internal Server Error"})
  }
}

async function EditUserProfile(req,res){
try{
  console.log(req.body);
}catch(error){
  console.log(error);
  return res.status(500).json({message:"Internal Server Error"})
}
}
exports.path = { getAllUsers, getOneUser, UpdateUser, AddCoverPhoto, upload };


