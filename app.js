const express = require('express');
const app = express();

const indexRoute = require('./routes/index.routes');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("assets/images"));
app.use('/', indexRoute);


module.exports = app;