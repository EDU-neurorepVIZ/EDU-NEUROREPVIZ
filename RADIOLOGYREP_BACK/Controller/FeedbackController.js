const Feedback = require("../Schemas/Feedback.js");
const mongoose = require("mongoose");

//Create new Feedback
exports.create = (req, res) => {
  // Request validation
  if (!req.body) {
    return res.status(400).send({
      message: "Feedback content can not be empty"
    });
  }

  var Feedback = mongoose.model("Feedback");
  // Create a Feedback
  const newFeedback = new Feedback({
    ownerId: req.body.ownerId,
    filename: req.body.filename,
    originalname: req.body.originalname,
    type: req.body.type
  });
  //sanitize input.

  // Save Feedback in the database
  newFeedback
    .save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Something wrong while creating the Feedback."
      });
    });
};

// Retrieve all Feedbacks from the database.
exports.findAll = (req, res) => {
  Feedback.find()
    .then(Feedback => {
      res.send(Feedback);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Something wrong while retrieving Feedbacks."
      });
    });
};

// Find a single Feedback with a FeedbackId
exports.findOne = (req, res) => {
  Feedback.findById(req.params.FeedbackId)
    .then(Feedback => {
      if (!Feedback) {
        return res.status(404).send({
          message: "Feedback not found with id " + req.params.FeedbackId
        });
      }
      res.send(Feedback);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Feedback not found with id " + req.params.FeedbackId
        });
      }
      return res.status(500).send({
        message:
          "Something wrong retrieving Feedback with id " +
          req.params.FeedbackId
      });
    });
};

// Find a single User with a SubmissionId
exports.findOneFeedback = (req, res) => {
  console.log(req.params);
  Feedback.findOne({ ownerId: req.params.ownerId })
    .then(Feedback => {
      if (!Feedback) {
        return res.status(404).send({
          message: "User not found with email " + req.params.ownerId
        });
      }
      res.send(Feedback);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "User not found with email " + req.params.ownerId
        });
      }
      return res.status(500).send({
        message:
          "Something wrong retrieving User with email " + req.params.ownerId
      });
    });
};

// Update a Feedback
exports.update = (req, res) => {
  console.log("UPDATING FEEDBACK");
  console.log(req.body);
  // Validate Request
  if (!req.body) {
    return res.status(400).send({
      message: "Feedback content can not be empty"
    });
  }

  // Find and update Feedback with the request body
  Feedback.findByIdAndUpdate(
    req.params.FeedbackId,
    {
      filename: req.body.filename,
      originalname: req.body.originalname
      //check how to add 1 element to the list of users
    },
    { new: true }
  )
    .then(Feedback => {
      if (!Feedback) {
        return res.status(404).send({
          message: "Feedback not found with id " + req.params.FeedbackId
        });
      }
      res.send(Feedback);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Feedback not found with id " + req.params.FeedbackId
        });
      }
      return res.status(500).send({
        message:
          "Something wrong updating note with id " + req.params.FeedbackId
      });
    });
};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
  Feedback.findByIdAndRemove(req.params.FeedbackId)
    .then(Feedback => {
      if (!Feedback) {
        return res.status(404).send({
          message: "Feedback not found with id " + req.params.FeedbackId
        });
      }
      res.send({ message: "Feedback deleted successfully!" });
    })
    .catch(err => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "Feedback not found with id " + req.params.FeedbackId
        });
      }
      return res.status(500).send({
        message:
          "Could not delete Feedback with id " + req.params.FeedbackId
      });
    });
};
