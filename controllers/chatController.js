const Chat = require('../models/chat');
const Homeowner = require('../models/homeowner');
const Freelancer = require('../models/freelancer');

class ChatController {
  static async startChat(req, res) {
    const { freelancerId, homeownerId } = req.body;

    try {
      let chat = await Chat.findOne({ freelancerId, homeownerId });
      if (chat) {
        return res.status(200).json({ chat });
      }

      chat = new Chat({ freelancerId, homeownerId });
      await chat.save();

      res.status(201).json({ chat });
    } catch (error) {
      res.status(500).json({ error: 'Failed to start chat', details: error.message });
    }
  }

  static async listChats(req, res) {
    const { userId } = req.params;

    try {
      const chats = await Chat.find({
        $or: [{ freelancerId: userId }, { homeownerId: userId }],
      }).populate('freelancerId homeownerId', 'name email username');

      const populatedChats = await Promise.all(chats.map(async chat => {
        const [freelancer, homeowner] = await Promise.all([
          Freelancer.findOne({ userId: chat.freelancerId }, 'pictureData'),
          Homeowner.findOne({ userId: chat.homeownerId }, 'pictureData')
        ]);

        return {
          ...chat.toObject(),
          freelancerPicture: Buffer.from(freelancer?.pictureData || '').toString('base64'),
          homeownerPicture: Buffer.from(homeowner?.pictureData || '').toString('base64')
        };
      }));

      res.status(200).json({ chats: populatedChats });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve chats', details: error.message });
    }
  }
}

module.exports = ChatController;