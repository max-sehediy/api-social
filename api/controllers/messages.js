const Message = require("../models/Message");



class messagesController {
  async addMessage(req, res) {
    const newMessage = new Message(req.body);

    try {
      const savedMessage = await newMessage.save();
      res.status(200).json(savedMessage);
    } catch (err) {
      console.log(err)
      res.status(500).json(err);
    }
  }
  async getMessage(req, res) {
    try {
      const messages = await Message.find({
        conversationId: req.params.conversationId,
      });
      res.status(200).json(messages);
    } catch (err) {
      console.log('get', err)

      res.status(500).json(err);
    }
  }
}

module.exports = new messagesController()