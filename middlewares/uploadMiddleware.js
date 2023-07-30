const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });

const upload = uploadMiddleware.single("file");

module.exports = upload;
