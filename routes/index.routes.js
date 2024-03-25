const fs = require("fs");
const path = require("path");
const express = require('express');
const router = express.Router();
const compileRoutes = require('./compile.routes');
const readRoutes = require('./read.routes');


router.use('/compile', compileRoutes);

router.use("/read", readRoutes);

router.get('/', (req, res) => {
    const indexPageFilePath = path.join(__dirname, "..", "views", "index.html")
    return res.status(200).sendFile(indexPageFilePath);
});

module.exports = router;