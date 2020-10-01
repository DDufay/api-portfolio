require('dotenv').config();
require('./database/Connection');

const express = require("express");
const app = express();
app.use(express.json());

const router = require('./Route');

router(app);

app.listen(process.env.PORT, () => console.log(`App listening on port ${process.env.PORT}`));

module.exports = app;
