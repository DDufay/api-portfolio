require('dotenv').config();
require('./database/Connection');

const express = require("express");
const app = express();
app.use(express.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
const router = require('./Route');

router(app);

app.listen(process.env.PORT, () => console.log(`App listening on port ${process.env.PORT}`));

module.exports = app;
