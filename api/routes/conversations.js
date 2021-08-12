const router = require("express").Router();
const conversationController = require('../controllers/conversation')

//new conv
router.post("/", conversationController.newConversation);

//get conv of a user
router.get("/:userId", conversationController.getConvUser);

// get conversations array
router.get("/:userId/friends", conversationController.getConvArray);

// get conv includes two userId
router.get("/find/:firstUserId/:secondUserId", conversationController.getConvTWOusers);

module.exports = router;
