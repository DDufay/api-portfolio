const mongoose = require('mongoose');
require('dotenv').config();


// Allow server to connect to the mongoDB
mongoose.connect(process.env.NODE_ENV === 'test' ? process.env.DB_CONNECTION_TEST : process.env.DB_CONNECTION, { useNewUrlParser: true , useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

console.info(`Server launch in ${process.env.NODE_ENV} mode`);

mongoose.connection
    .once('open', () => {})
    .on('error', error => console.log(error))
