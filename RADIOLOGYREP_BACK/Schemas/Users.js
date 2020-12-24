const mongoose = require('mongoose');


//edit schema
const UserSchema = mongoose.Schema({
    name: String,
    email: String,
    role: String
}, {
    timestamps: true
});

module.exports = exports = mongoose.model('User', UserSchema)