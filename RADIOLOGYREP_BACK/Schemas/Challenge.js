const mongoose = require('mongoose');


//edit schema
const ChallengeSchema = mongoose.Schema({
    groupId: String,
    name: String,
    sampleId: String,
    description: String,
    status: String,
    endDate: String
}, {
    timestamps: true
});

// no enviado, enviado, cerrado, en-correcion, terminado

module.exports = mongoose.model('Challenges', ChallengeSchema);