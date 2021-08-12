const Conversation = require('../models/Conversation')


class conversationController {

  async newConversation(req, res) {
    const newConversation = new Conversation({
      members: [req.body.senderId, req.body.receiverId],
    });
    try {
      const savedConversation = await newConversation.save();
      res.status(200).json(savedConversation);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  //get conv of a user
  async getConvUser(req, res) {
    try {
      const conversation = await Conversation.find({
        members: { $in: [req.params.userId] },
      });

      res.status(200).json(conversation);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // get conversations array
  async getConvArray(req, res) {
    try {
      const conversation = await Conversation.find({
        members: { $in: [req.params.userId] },
      });
      let result = []
      conversation.forEach(el => {
        el.members.forEach(e => {
          result.push(e)
        })
      });
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  }

  // get conv includes two userId
  async getConvTWOusers(req, res) {
    try {
      const conversation = await Conversation.findOne({
        members: { $all: [req.params.firstUserId, req.params.secondUserId] },
      });
      res.status(200).json(conversation)
    } catch (err) {
      res.status(500).json(err);
    }
  }
}

module.exports = new conversationController()