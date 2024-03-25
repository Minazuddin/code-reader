const fs = require("fs");
const path = require("path");
const util = require("node:util");
const exec = util.promisify(require("node:child_process").exec);
const express = require("express");
const router = express.Router();


// does not work on `npm run dev`
router.post("/", async (req, res) => {
  const data = req.body;
  
  // 1. write code file
  const filename = "code.js";
  const filePath = path.join(__dirname, "..", filename);
  fs.writeFileSync(filePath, data.code);
  
  // 2. execute code file
  console.log(`executing command - node ${filename}`);
  const { stderr, stdout } = await exec(`node ${filename}`);
  
  if (stderr) {
    console.error(stderr);
    return res.status(400).json({
      success: false,
      data: stderr,
    });
  }
  console.log("stdout", stdout);
  let outputHtml = `<pre>${stdout}</pre>`;
  
  return res.status(200).json({
    success: true,
    data: outputHtml
  })
});

module.exports = router;
