const express = require("express");
const path = require("path");
const helmet = require("helmet");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
dotenv.config();
const logger = require("morgan");
const router = require("./routes");
const rateLimit = require("express-rate-limit");

const connectDB = require("./config/db");
const cors = require("cors");
const { errorHandler, notFound } = require("./middlewares/errorMiddleware");
connectDB();

const app = express();

// Trust proxy before applying the rate limiter middleware
// If your server is behind a proxy or load balancer, this ensures that Express uses the X-Forwarded-For header.
// app.set("trust proxy", numberOfProxies);

app.set("trust proxy", "loopback");

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

// Enable CORS for cross-origin requests

const corsOptions = {
  origin: ["https://utiva-blog-frontend.vercel.app", "http://localhost:3000"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/uploads", express.static(__dirname + "/uploads"));
// app.use(express.static(path.join(__dirname, "public")));
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/api", limiter, router);
// app.use("/api", router);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    data: "Welcome to the MERN Stack API",
  });
});

app.use(notFound);
app.use(errorHandler);
module.exports = app;
