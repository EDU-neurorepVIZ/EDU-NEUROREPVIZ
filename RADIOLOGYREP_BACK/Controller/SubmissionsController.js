const Submission = require("../Schemas/Submission.js");
const mongoose = require("mongoose");

//Create new Submission
exports.create = (req, res) => {
  // Request validation
  if (!req.body) {
    return res.status(400).send({
      message: "Submission content can not be empty"
    });
  }

  var Submission = mongoose.model("Submissions");
  // Create a Challenge
  const newSubmission = new Submission({
    ownerId: req.body.ownerId,
    challengeId: req.body.challengeId,
    status: req.body.status
  });
  // Save Submission in the database
  newSubmission
    .save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Something wrong while creating the Submission."
      });
    });
};

// Retrieve all Submissions from the database.
exports.findAll = (req, res) => {
  Submission.find()
    .then(Submissions => {
      res.send(Submissions);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Something wrong while retrieving Submissions."
      });
    });
};

// Find a single Submission with a SubmissionId
exports.findOne = (req, res) => {
  Submission.findById(req.params.SubmissionId)
    .then(Submission => {
      if (!Submission) {
        return res.status(404).send({
          message: "Submission not found with id " + req.params.SubmissionId
        });
      }
      res.send(Submission);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Submission not found with id " + req.params.SubmissionId
        });
      }
      return res.status(500).send({
        message:
          "Something wrong retrieving Submission with id " +
          req.params.SubmissionId
      });
    });
};

// Update a Submission
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    return res.status(400).send({
      message: "Submission content can not be empty"
    });
  }

  // Find and update Submission with the request body
  Submission.findByIdAndUpdate(
    req.params.SubmissionId,
    {
      status: req.body.status,
      comment: req.body.comment
      //Change status of the assignment and also change the feedback to the user
    },
    { new: true }
  )
    .then(Submission => {
      if (!Submission) {
        return res.status(404).send({
          message: "Submission not found with id " + req.params.SubmissionId
        });
      }
      res.send(Submission);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Submission not found with id " + req.params.SubmissionId
        });
      }
      return res.status(500).send({
        message:
          "Something wrong updating note with id " + req.params.SubmissionId
      });
    });
};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
  Submission.findByIdAndRemove(req.params.SubmissionId)
    .then(Submission => {
      if (!Submission) {
        return res.status(404).send({
          message: "Submission not found with id " + req.params.SubmissionId
        });
      }
      res.send({ message: "Submission deleted successfully!" });
    })
    .catch(err => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "Submission not found with id " + req.params.SubmissionId
        });
      }
      return res.status(500).send({
        message:
          "Could not delete Submission with id " + req.params.SubmissionId
      });
    });
};
