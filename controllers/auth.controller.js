const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.models");

const signup = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY);

    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);

    res.status(200).json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  
  if (!token) {
    return res.status(401).json({ message: "You are not logged in. Please login to access this route" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const currentUser = await User.findById(decoded.userId);
    
    if (!currentUser) {
      return res.status(401).json({ message: "The user that belongs to this token no longer exists" });
    }
    
    req.user = currentUser;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = {
  signup,
  login,
  protect,
};
