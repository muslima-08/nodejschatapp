const bcrypt = require('bcrypt')
const userModel = require('../Models/userModel')
const cloudinary = require('cloudinary')
const Users = require("../Models/userModel")
const { json } = require('express')
const { removeTemp, uploadFile, deleteFile } = require('../services/Cloudinary')

const userCtrl = {
  // Get a user 
  getUser: async (req, res) => {
    const { id } = req.params

    try {
      const user = await Users.findById(id)
      if (user) {
        const { password, ...otherDetails } = user._doc
        return res.status(200).json(otherDetails)

      }
      res.status(404).json({ message: "User not found" })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },
  getAllUser: async (req, res) => {
    try {
      let users = await Users.find()
      users = users.map(user => {
        const { password, ...otherDetails } = user._doc
        return otherDetails
      })
      res.status(200).json(users)
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },
  updateUser: async (req, res) => {

    const { id } = req.params

    try {
      const { currentUserAdmin } = req;
      if (id === req.user.id || currentUserAdmin) {
        const user = await Users.findById(id)
        if (req.body.password) {
          const hashedPassword = await bcrypt.hash(req.body.password, 12)
          req.body.password = hashedPassword
        }


        if (req.files) {
          if (req.files.profilePicture) {
            const profilePicture = req.files.profilePicture;
            if (profilePicture.mimetype !== "image/jpeg" && profilePicture.mimetype !== "image/png") {
              removeTemp(profilePicture.tempFilePath);
              return res.status(404).json({ message: "File not supported" })

            }
            const img = await uploadFile(profilePicture)
            req.body.profilePicture = img;

            await deleteFile(user.profilePicture.public_id)
          }

          if (req.files.coverPicture) {
            const coverPicture = req.files.coverPicture;
            if (req.files.coverPicture) {
              const coverPicture = req.files.coverPicture;
              if (coverPicture.mimetype !== "image/jpeg" && coverPicture.mimetype !== "image/png") {
                removeTemp(coverPicture.tempFilePath);
                return res.status(404).json({ message: "File not supported" })

              }
              const img = await uploadFile(profilePicture)
              req.body.profilePicture = img;

              await deleteFile(user.coverPicture.public_id);

            }


          }

          const updatedUser = await Users.findByIdAndUpdate(id, req.body, { new: true })
          const { password, ...otherDetails } = updatedUser._doc
          return res.status(200).json(otherDetails)
        } else {
          res.status(403).json({ message: "Access denied : You can update only your own account" })
        }
      } 
    }catch (error) {
      res.status(500).json({ message: error.message })
    }
    
  },
  deleteUser: async (req, res) => {
    const { id } = req.params;
    const { currentUserAdmin } = req;
    try {
      if (id === req.user.id || currentUserAdmin) {
        const deleteUser = await Users.findByIdAndDelete(id)
        if (deleteUser) {
          return res.status(200).json({ message: "User deleted" })
        }
        res.status(404).json({ message: "User not found" })
      } else {
        res.status(403).json({ message: "Access denied : You can update only your own account" })
      }
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}

module.exports = userCtrl
