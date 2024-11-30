const Message = require('../models/message');

class MessageController {
  // Send a new message
  static async sendMessage(req, res) {
    const { chatId, senderId, content, type } = req.body;

    try {
      const message = new Message({ chatId, senderId, content, type });
      await message.save();

      res.status(201).json({ message });
    } catch (error) {
      res.status(500).json({ error: 'Failed to send message', details: error.message });
    }
  }

  // Get messages for a specific chat
  static async getMessages(req, res) {
    const { chatId } = req.params;

    try {
      const messages = await Message.find({ chatId }).sort({ timestamp: 1 });
      res.status(200).json({ messages });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve messages', details: error.message });
    }
  }
}

module.exports = MessageController;
