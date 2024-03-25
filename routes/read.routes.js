const fs = require("fs");
const path = require("path");
const express = require("express");
const ReadCodeHelpers = require("../helpers/read-code.helpers");
const router = express.Router();

router.post("/", async (req, res) => {
  const data = req.body;

  // 1. write code file
  const filename = "code.js";
  const filePath = path.join(__dirname, "..", filename);
  fs.writeFileSync(filePath, data.code);

  // 2. read code flow
  const result = await ReadCodeHelpers.readCodeFlow(
    fs.readFileSync(filename).toString()
  );

  if (!result.success) {
    return res.status(200).json({
      success: false,
      data: result.data,
    });
  }
  return res.status(200).json({
    success: true,
    data: result.data,
  });
});

module.exports = router;
