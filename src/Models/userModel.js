const mongoose = require('mongoose');


const userSchema = mongoose.Schema({

  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    default: 100,
    enum: [100, 101], ///user-100 101-admin
  },
  profilePicture: {
    type: Object,
    default: "",
  },
  coverPicture: {
    type: Object,
    default: "",
  },
  about: String,
  livesIn: String,
  worksAt: String,
  relationship: String,
  country: String,
  hobby: String,
}, { timestamps: true }
)

module.exports = mongoose.model('User', userSchema)