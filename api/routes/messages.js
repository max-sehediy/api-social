const router = require("express").Router();
const messagesController = require('../controllers/messages')

//add
router.post("/", messagesController.addMessage);

//get
router.get("/:conversationId", messagesController.getMessage);

module.exports = router;
