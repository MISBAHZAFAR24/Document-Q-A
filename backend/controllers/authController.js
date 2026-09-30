const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function createToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "development-secret", { expiresIn: "7d" });
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) return res.status(409).json({ message: "Email is already registered" });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword });
    return res.status(201).json({ token: createToken(user.id), user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() }).select("+password");
    if (!user || !(await bcrypt.compare(password || "", user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.json({ token: createToken(user.id), user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    return next(error);
  }
}

module.exports = { register, login };
