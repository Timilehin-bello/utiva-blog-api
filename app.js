const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
dotenv.config();
const logger = require("morgan");
const router = require("./routes");

const connectDB = require("./config/db");
const cors = require("cors");
const { errorHandler, notFound } = require("./middlewares/errorMiddleware");
connectDB();

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/uploads", express.static(__dirname + "/uploads"));
// app.use(express.static(path.join(__dirname, "public")));

app.use("/api", router);
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    data: "Welcome to the MERN Stack API",
  });
});

app.use(notFound);
app.use(errorHandler);
module.exports = app;
