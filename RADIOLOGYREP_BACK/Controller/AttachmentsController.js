const Attachment = require("../Schemas/Attachment.js");
const mongoose = require("mongoose");

//Create new Attachment
exports.create = (req, res) => {
  // Request validation
  if (!req.body) {
    return res.status(400).send({
      message: "Attachment content can not be empty"
    });
  }

  var Attachment = mongoose.model("Attachments");
  // Create a Attachment
  const newAttachment = new Attachment({
    ownerId: req.body.ownerId,
    filename: req.body.filename,
    originalname: req.body.originalname,
    type: req.body.type
  });
  //sanitize input.

  // Save Attachment in the database
  newAttachment
    .save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Something wrong while creating the Attachment."
      });
    });
};

// Retrieve all Attachments from the database.
exports.findAll = (req, res) => {
  Attachment.find()
    .then(Attachments => {
      res.send(Attachments);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Something wrong while retrieving Attachments."
      });
    });
};

// Find a single Attachment with a AttachmentId
exports.findOne = (req, res) => {
  Attachment.findById(req.params.AttachmentId)
    .then(Attachment => {
      if (!Attachment) {
        return res.status(404).send({
          message: "Attachment not found with id " + req.params.AttachmentId
        });
      }
      res.send(Attachment);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Attachment not found with id " + req.params.AttachmentId
        });
      }
      return res.status(500).send({
        message:
          "Something wrong retrieving Attachment with id " +
          req.params.AttachmentId
      });
    });
};

// Find a single User with a SubmissionId
exports.findOneAttachment = (req, res) => {
  console.log(req.params);
  Attachment.findOne({ ownerId: req.params.ownerId })
    .then(Attachment => {
      if (!Attachment) {
        return res.status(404).send({
          message: "User not found with email " + req.params.ownerId
        });
      }
      res.send(Attachment);
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

// Update a Attachment
exports.update = (req, res) => {
  console.log("UPDATING ATTACHMENT");
  console.log(req.body);
  // Validate Request
  if (!req.body) {
    return res.status(400).send({
      message: "Attachment content can not be empty"
    });
  }

  // Find and update Attachment with the request body
  Attachment.findByIdAndUpdate(
    req.params.AttachmentId,
    {
      filename: req.body.filename,
      originalname: req.body.originalname
      //check how to add 1 element to the list of users
    },
    { new: true }
  )
    .then(Attachment => {
      if (!Attachment) {
        return res.status(404).send({
          message: "Attachment not found with id " + req.params.AttachmentId
        });
      }
      res.send(Attachment);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Attachment not found with id " + req.params.AttachmentId
        });
      }
      return res.status(500).send({
        message:
          "Something wrong updating note with id " + req.params.AttachmentId
      });
    });
};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
  Attachment.findByIdAndRemove(req.params.AttachmentId)
    .then(Attachment => {
      if (!Attachment) {
        return res.status(404).send({
          message: "Attachment not found with id " + req.params.AttachmentId
        });
      }
      res.send({ message: "Attachment deleted successfully!" });
    })
    .catch(err => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "Attachment not found with id " + req.params.AttachmentId
        });
      }
      return res.status(500).send({
        message:
          "Could not delete Attachment with id " + req.params.AttachmentId
      });
    });
};
