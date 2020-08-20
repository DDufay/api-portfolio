const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    password: String,
    refreshToken: String,
});

const UserCollection = mongoose.model('user', userSchema);

module.exports = UserCollection;