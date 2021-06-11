const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const user = require("../models/user");

const register = async (req, res) => {
  const { email, username, password } = req.body;

  // const email = req.body.email;
  // const username = req.body.username;
  // const password = req.boy.password;
const register = async (req, res) => {
  const { email, username, password } = req.body;

  // check if username/email is already in database
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).send("email already exists.");
  }

  // hashing of password
  const hashedPassword = await bcrypt.hash(password, 12);

  // create user
  const user = await User.create({
    email,
    username,
    password: hashedPassword,
  });

  // generating a token
  const token = jwt.sign({ id: user._id }, "123456789", { expiresIn: "1h" });

  // return response
  res.status(201).json({ token });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // check if user is in the DB
  let user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send("Invalid Credential");
  }

  // compares passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).send("Invalid Credential");
  }
  // generating a token
  const token = jwt.sign({ id: user._id }, "123456789", { expiresIn: "1h" });

  // return response
  res.status(200).json({ token });
};

const verifyToken = (req, res, next) => {
  const token = req.headers;
  console.log(token)
  console.log("Token verified");
  next();

}
module.exports = {
  register,
  login,
  verifyToken,
};
