const Message = require("../models/message.models");
const User = require("../models/user.models");
const socketIO = require("socket.io");

const io = socketIO();

const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId, content } = req.body;

    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      content,
    });

    await message.save();

    io.to(receiver._id.toString()).emit("newMessage", message);

    res.status(201).json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getMessages = async (req, res) => {
  try {
    const userId = req.user._id;

    const messages = await Message.find({ receiver: userId })
      .populate("receiver", "username")
      .select("receiver content _id");

    res.status(200).json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  sendMessage,
  getMessages,
};
