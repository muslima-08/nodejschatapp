const mongoose = require('mongoose');


const messageSchema = mongoose.Schema({

  chatId: {
    type: String,
    required: true,
  },
  senderId: {
    type: String,
    required: true,
  },
  text: {
    type: String,
  },
  file: {
    type: Object,
    default: "",
  },
  isRead: {
    type: Boolean,
    default: false
  }


}, { timeStamps: true }
)

module.exports = mongoose.model('Message', messageSchema)