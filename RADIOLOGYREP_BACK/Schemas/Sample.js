const mongoose = require('mongoose');


//edit schema
const SampleSchema = mongoose.Schema({
    ownerId: String,
    name: String,
    subjects: [{id: String}],
    description: String
}, {
    timestamps: true
});

//Los subjects son los ID's de los pacientes en excel :)

module.exports = mongoose.model('Samples', SampleSchema);