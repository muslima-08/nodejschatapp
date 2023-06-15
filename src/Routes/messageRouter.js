const router = require("express").Router();

const messageCtrl = require("../Controllers/messageCtrl");
const { authMiddlaware } = require("../middlewares/authMiddlawers");


router.post("/", authMiddlaware, messageCtrl.addMessage)
router.get("/:chatId", authMiddlaware, messageCtrl.getMessages)
router.delete("/:messageid", authMiddlaware, messageCtrl.deleteMessage)

module.exports = router;