const express = require("express");
const router = express.Router();

require("./userRoutes")(router);
require("./postRoutes")(router);

module.exports = router;
