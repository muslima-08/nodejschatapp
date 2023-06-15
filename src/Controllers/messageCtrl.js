const { findByIdAndDelete } = require("../Models/chatModel")
const Message = require("../Models/messageModel")

const { removeTemp, uploadFile, deleteFile } = require('../services/Cloudinary')



const messageCtrl = {
  addMessage: async (req, res) => {
    const { chatId, senderId, text } = req.body
    try {
      if (!chatId || !senderId) {
        return res.status(403).json("Invalid credentials")
      }
      if (req.files) {
        const image = req.files.image;
        if (image.mimetype !== "image/jpeg" && image.mimetype !== "image/png") {
          removeTemp(image.tempFilePath);
          return res.status(404).json({ message: "File not supported" })


          const img = await uploadFile(image)
          req.body.file = img;


          const message = new Message(req.body);
          await message.save()
          res.status(201).json(message)
        }
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }, getMessages: async (req, res) => {
    try {
      const { chatId } = req.params;
      const messages = await Message.find({ chatId })
      res.status(200).json(messages)
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  deleteMessage: async (req, res) => {
    try {
      const { messageid } = req.params;
      const message = await Message.findOneAndDelete(messageid)
      if (message) {
        if (message.file.public_id) {
          await deleteFile(message.file.public_id);
        }
        return res.status(200).json({ message: "Message deleted succesfully" })
      }
      res.status(404).json({ message: "Message not found!" })
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = messageCtrl