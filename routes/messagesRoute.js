const express = require("express");
const router = express.Router();
const cors = require("cors");

router.use(cors());

router.get("/", (req, res) => {
  res.send("Messages Route is this one");
});

module.exports = router;
