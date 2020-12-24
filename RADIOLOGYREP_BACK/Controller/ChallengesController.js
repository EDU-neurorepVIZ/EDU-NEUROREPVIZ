const Challenge = require("../Schemas/Challenge.js");
const mongoose = require("mongoose");

//Create new Challenge
exports.create = (req, res) => {
  // Request validation
  if (!req.body) {
    return res.status(400).send({
      message: "Challenge content can not be empty"
    });
  }

  var Challenge = mongoose.model("Challenges");
  // Create a Challenge
  const newChallenge = new Challenge({
    groupId: req.body.groupId,
    name: req.body.name,
    description: req.body.description,
    sampleId: req.body.sample,
    status: req.body.status,
    endDate: req.body.endDate
  });
  // Save Challenge in the database
  newChallenge
    .save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Something wrong while creating the Challenge."
      });
    });
};

// Retrieve all Challenges from the database.
exports.findAll = (req, res) => {
  Challenge.find()
    .then(Challenges => {
      res.send(Challenges);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Something wrong while retrieving Challenges."
      });
    });
};

// Find a single Challenge with a ChallengeId
exports.findOne = (req, res) => {
  Challenge.findById(req.params.ChallengeId)
    .then(Challenge => {
      if (!Challenge) {
        return res.status(404).send({
          message: "Challenge not found with id " + req.params.ChallengeId
        });
      }
      res.send(Challenge);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Challenge not found with id " + req.params.ChallengeId
        });
      }
      return res.status(500).send({
        message:
          "Something wrong retrieving Challenge with id " +
          req.params.ChallengeId
      });
    });
};

// Update a Challenge
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    return res.status(400).send({
      message: "Challenge content can not be empty"
    });
  }

  // Find and update Challenge with the request body
  Challenge.findByIdAndUpdate(
    req.params.ChallengeId,
    {
      status: req.body.status
    },
    { new: true }
  )
    .then(Challenge => {
      if (!Challenge) {
        return res.status(404).send({
          message: "Challenge not found with id " + req.params.ChallengeId
        });
      }
      res.send(Challenge);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Challenge not found with id " + req.params.ChallengeId
        });
      }
      return res.status(500).send({
        message:
          "Something wrong updating note with id " + req.params.ChallengeId
      });
    });
};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
  Challenge.findByIdAndRemove(req.params.ChallengeId)
    .then(Challenge => {
      if (!Challenge) {
        return res.status(404).send({
          message: "Challenge not found with id " + req.params.ChallengeId
        });
      }
      res.send({ message: "Challenge deleted successfully!" });
    })
    .catch(err => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "Challenge not found with id " + req.params.ChallengeId
        });
      }
      return res.status(500).send({
        message: "Could not delete Challenge with id " + req.params.ChallengeId
      });
    });
};
