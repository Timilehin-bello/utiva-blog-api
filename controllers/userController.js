const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const salt = bcrypt.genSaltSync(10);
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({
      status: "failed",
      message: "Please provide a username and password",
    });
  }
  const userDoc = await User.findOne({ username });

  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    // logged in
    jwt.sign(
      { username, id: userDoc._id },
      process.env.JWT_SECRET,
      {},
      (err, token) => {
        if (err) throw err;
        res.cookie("token", token).json({
          id: userDoc._id,
          username,
        });
      }
    );
  } else {
    res.status(400).json("wrong credentials");
  }
};

exports.profile = async (req, res) => {
  const { token } = req.cookies;
  try {
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, info) => {
      if (err) throw err;
      res.json(info);
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.logout = async (req, res) => {
  res.cookie("token", "").json("logged out");
};
