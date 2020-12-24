const Sample = require('../Schemas/Sample.js');
const mongoose = require('mongoose');


//Create new Sample
exports.create = (req, res) => {
    // Request validation
    if(!req.body) {
        return res.status(400).send({
            message: "Sample content can not be empty"
        });
    }

    var Sample = mongoose.model("Samples");

    var subjects = req.body.subjects.split(",")
    var objSubjects = []
    for (var i = subjects.length - 1; i >= 0; i--) {
        objSubjects.push({'id':subjects[i]})
    }

    // Create a Sample
    const newSample = new Sample({
        ownerId: req.body.ownerId,
        name: req.body.name,
        subjects: objSubjects,
        description: req.body.description})
        //sanitize input.

    // Save Sample in the database
    newSample.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Something wrong while creating the Sample."
        });
    });
};

// Retrieve all Samples from the database.
exports.findAll = (req, res) => {
    Sample.find()
    .then(Samples => {
        res.send(Samples);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Something wrong while retrieving Samples."
        });
    });
};

// Find a single Sample with a SampleId
exports.findOne = (req, res) => {
    Sample.findById(req.params.SampleId)
    .then(Sample => {
        if(!Sample) {
            return res.status(404).send({
                message: "Sample not found with id " + req.params.SampleId
            });            
        }
        res.send(Sample);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Sample not found with id " + req.params.SampleId
            });                
        }
        return res.status(500).send({
            message: "Something wrong retrieving Sample with id " + req.params.SampleId
        });
    });
};

// Update a Sample
exports.update = (req, res) => {
    // Validate Request
    if(!req.body) {
        return res.status(400).send({
            message: "Sample content can not be empty"
        });
    }

    // Find and update Sample with the request body
    Sample.findByIdAndUpdate(req.params.SampleId, {
        name: req.body.name,
        description: req.body.description
        //check how to add 1 element to the list of users
    }, {new: true})
    .then(Sample => {
        if(!Sample) {
            return res.status(404).send({
                message: "Sample not found with id " + req.params.SampleId
            });
        }
        res.send(Sample);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Sample not found with id " + req.params.SampleId
            });                
        }
        return res.status(500).send({
            message: "Something wrong updating note with id " + req.params.SampleId
        });
    });
};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
    Sample.findByIdAndRemove(req.params.SampleId)
    .then(Sample => {
        if(!Sample) {
            return res.status(404).send({
                message: "Sample not found with id " + req.params.SampleId
            });
        }
        res.send({message: "Sample deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Sample not found with id " + req.params.SampleId
            });                
        }
        return res.status(500).send({
            message: "Could not delete Sample with id " + req.params.SampleId
        });
    });
};