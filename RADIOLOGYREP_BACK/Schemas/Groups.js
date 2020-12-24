const mongoose = require('mongoose');


//edit schema
const GroupSchema = mongoose.Schema({
    ownerEmails: [{email: String}],
    name: String,
    members: [{email: String}]
}, {
    timestamps: true
});

module.exports = mongoose.model('Groups', GroupSchema);