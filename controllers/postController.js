const jwt = require("jsonwebtoken");
const Post = require("../models/Post");
const fs = require("fs");

exports.createPost = async (req, res) => {
  const { originalname, path } = req.file;

  const { title, summary, content } = req.body;

  if ((!title || !summary || !content, !originalname)) {
    res.status(400).json({
      status: "failed",
      message: "Please provide a title, summary and content",
    });
  }

  try {
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);

    const { token } = req.cookies;
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
      if (err) throw err;
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: newPath,
        author: info.id,
      });
      res.json(postDoc);
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.updatePost = async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }

  const { id, title, summary, content } = req.body;

  if (!id || !title || !summary || !content) {
    res.status(400).json({
      status: "failed",
      message: "Please provide an id, title, summary and content",
    });
  }

  try {
    const { token } = req.cookies;
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
      if (err) throw err;
      const postDoc = await Post.findById(id);
      const isAuthor =
        JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(400).json("you are not the author");
      }
      const updatedPost = await Post.findOneAndUpdate(
        { _id: id, author: info.id }, // The conditions to find the post
        { title, summary, content, cover: newPath ? newPath : postDoc.cover }, // The new values to update
        { new: true } // To return the updated postDoc
      );

      res.json(updatedPost);
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.getPost = async (req, res) => {
  try {
    const user = await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const postDoc = await Post.findById(id).populate("author", ["username"]);
    res.json(postDoc);
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.getPostById = async (req, res) => {
  const { id } = req.params;
  try {
    const postDoc = await Post.findById(id).populate("author", ["username"]);
    res.json(postDoc);
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
