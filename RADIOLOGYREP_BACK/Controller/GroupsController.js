const Group = require('../Schemas/Groups.js');
const mongoose = require('mongoose');

//Create new Group
exports.create = (req, res) => {
    // Request validation
    if(!req.body) {
        return res.status(400).send({
            message: "Group content can not be empty"
        });
    }

    var Group = mongoose.model("Groups");
    // Create a Group
    var students = req.body.members.split(",")
    var objStudents = []
    for (var i = students.length - 1; i >= 0; i--) {
        objStudents.push({'email':students[i]})
    }

    var professors =  req.body.ownerEmails.split(",")
    var objProfessors = []
    for (var i = professors.length - 1; i >= 0; i--) {
        objProfessors.push({'email':professors[i]})
    }
   
    const newGroup = new Group({
        ownerEmails: objProfessors,
        name: req.body.name,
        members: objStudents})
        //sanitize input
    // Save Group in the database
    newGroup.save().then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Something wrong while creating the Group."
        });
    });
};


// Update a Group
exports.update = (req, res) => {
    // Validate Request
    if(!req.body) {
        return res.status(400).send({
            message: "User content can not be empty"
        });
    }

    // Create a Group
    var students = req.body.members.split(",")
    var objStudents = []
    for (var i = students.length - 1; i >= 0; i--) {
        objStudents.push({'email':students[i]})
    }

    var professors =  req.body.ownerEmails.split(",")
    console.log(professors)
    var objProfessors = []
   
    for (var i = professors.length - 1; i >= 0; i--) {
        objProfessors.push({'email':professors[i]})
    }
    //console.log(objStudents)
    console.log(objProfessors)

    // Find and update User with the request body
    Group.findByIdAndUpdate(req.params.GroupId, {
        
        ownerEmails: objProfessors,
        members: objStudents
    }, {new: true})
    .then(Group => {
        if(!Group) {
            return res.status(404).send({
                message: "Group not found with id " + req.params.GroupId
            });
        }
        res.send(Group);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Group not found with id " + req.params.GroupId
            });                
        }
        return res.status(500).send({
            message: "Something wrong updating note with id " + req.params.GroupId
        });
    });
};




// Retrieve all Groups from the database.
exports.findAll = (req, res) => {
    Group.find()
    .then(Groups => {
        res.send(Groups);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Something wrong while retrieving Groups."
        });
    });
};

// Find a single Group with a GroupId
exports.findOne = (req, res) => {
    Group.findById(req.params.GroupId)
    .then(Group => {
        if(!Group) {
            return res.status(404).send({
                message: "Group not found with id " + req.params.GroupId
            });            
        }
        res.send(Group);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Group not found with id " + req.params.GroupId
            });                
        }
        return res.status(500).send({
            message: "Something wrong retrieving Group with id " + req.params.GroupId
        });
    });
};


// Update a Group
exports.addProfessor = (req, res) => {
    // Validate Request
    if(!req.body) {
        return res.status(400).send({
            message: "Group content can not be empty"
        });
    }

    // Find and update Group with the request body
   
    var professor = {"email": req.body.email}
    // Find and update Group with the request body
    Group.findByIdAndUpdate(req.params.GroupId, {$push: {ownerEmails: professor}}, {new: true})
    .then(Group => {
        if(!Group) {
            return res.status(404).send({
                message: "Group not found with id " + req.params.GroupId
            });
        }
        res.send(Group);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Group not found with id " + req.params.GroupId
            });                
        }
        return res.status(500).send({
            message: "Something wrong updating note with id " + req.params.GroupId
        });
    });
};

// Update a Group
exports.addStudent = (req, res) => {
    // Validate Request
    if(!req.body) {
        return res.status(400).send({
            message: "Group content can not be empty"
        });
    }

    var student = {"email": req.body.email}
    // Find and update Group with the request body
    Group.findByIdAndUpdate(req.params.GroupId, {$push: {members: student}}, {new: true})
    .then(Group => {
        if(!Group) {
            return res.status(404).send({
                message: "Group not found with id " + req.params.GroupId
            });
        }
        res.send(Group);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Group not found with id " + req.params.GroupId
            });                
        }
        return res.status(500).send({
            message: "Something wrong updating note with id " + req.params.GroupId
        });
    });
};

// Update a Group
exports.deleteProfessor = (req, res) => {
    // Validate Request
    if(!req.body) {
        return res.status(400).send({
            message: "Group content can not be empty"
        });
    }

    // Find and update Group with the request body
   
    var professor = {"email": req.body.email}
    // Find and update Group with the request body
    Group.findByIdAndUpdate(req.params.GroupId, {$pull: {ownerEmails: professor}}, {new: true})
    .then(Group => {
        if(!Group) {
            return res.status(404).send({
                message: "Group not found with id " + req.params.GroupId
            });
        }
        res.send(Group);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Group not found with id " + req.params.GroupId
            });                
        }
        return res.status(500).send({
            message: "Something wrong updating note with id " + req.params.GroupId
        });
    });
};

// Update a Group
exports.deleteStudent = (req, res) => {
    // Validate Request
    if(!req.body) {
        return res.status(400).send({
            message: "Group content can not be empty"
        });
    }

    var student = {"email": req.body.email}
    // Find and update Group with the request body
    Group.findByIdAndUpdate(req.params.GroupId, {$pull: {members: student}}, {new: true})
    .then(Group => {
        if(!Group) {
            return res.status(404).send({
                message: "Group not found with id " + req.params.GroupId
            });
        }
        res.send(Group);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Group not found with id " + req.params.GroupId
            });                
        }
        return res.status(500).send({
            message: "Something wrong updating note with id " + req.params.GroupId
        });
    });
};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
    Group.findByIdAndRemove(req.params.GroupId)
    .then(Group => {
        if(!Group) {
            return res.status(404).send({
                message: "Group not found with id " + req.params.GroupId
            });
        }
        res.send({message: "Group deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Group not found with id " + req.params.GroupId
            });                
        }
        return res.status(500).send({
            message: "Could not delete Group with id " + req.params.GroupId
        });
    });
};