const router = require("express").Router();

const chatCtrl = require("../Controllers/chatCtrl");
const { authMiddlaware } = require("../middlewares/authMiddlawers");


router.get("/:firstId/:secondId", chatCtrl.findChat)
router.get("/", authMiddlaware, chatCtrl.userChats)
router.delete("/:chatId", authMiddlaware, chatCtrl.deleteChats)
module.exports = router;