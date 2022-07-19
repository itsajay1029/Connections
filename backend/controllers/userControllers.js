const asyncHandler = require("express-async-handler");

const users = require("../models/userModel");
const generateToken = require("../config/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all fields");
  }

  const userExists = await users.findOne({ email });
  //console.log(userExists);

  if (userExists != null) {
    res.status(400);
    throw new Error("User already Exists !");
  }

  const user = await users.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create User");
  }
});

const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExists = await users.findOne({ email });

    if (userExists != null && (await userExists.matchPassword(password))) {
      res.status(201).json({
        _id: userExists._id,
        name: userExists.name,
        email: userExists.email,
        pic: userExists.pic,
        token: generateToken(userExists._id),
      });
    } else {
      res.sendStatus(401);
      throw new Error("User not found in database");
    }
  } catch (error) {
    res.sendStatus(401);
    throw new Error("Login Error Occurred");
  }
};

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const user = await users.find(keyword).find({ _id: { $ne: req.user._id } });

  res.send(user);
});

module.exports = { registerUser, authUser, allUsers };
