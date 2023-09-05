const User = require('../models/user.models');

const userprofile = async(req,res)=>{
    const profile = await User.findById(req.user._id);
    res.json({massage:"done",profile})
}

const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user: { username: user.username, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUserById = async (req, res) => {
  try {
    const userId = req.user._id;
    const updatedData = req.body;

    const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUserById,
  updateUserById,
  userprofile,
};
