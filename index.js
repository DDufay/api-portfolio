require('dotenv').config();
require('./database/Connection');

const express = require("express");
const app = express();
app.use(express.json());

const router = require('./Route');

router(app);

app.listen(3004, () => console.log(`App listening on port 3004`));

module.exports = app;
