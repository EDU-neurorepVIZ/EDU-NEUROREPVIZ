const mongoose = require('mongoose');


//edit schema
const AttachmentSchema = mongoose.Schema({
    ownerId: String,
    filename: String,
    originalname: String,
    type: String,
    //submissions,challenges,subjects
}, {
    timestamps: true
});

//Los subjects son los ID's de los pacientes en excel :)

module.exports = mongoose.model('Attachments', AttachmentSchema);