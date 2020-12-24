const User = require("../Schemas/Users");

const mongoose = require("mongoose");
const csv = require("fast-csv");
const fs = require("fs");
var Estudiantes = [];
var Profesores = [];
const ACL = fs
  .createReadStream("lista.csv")
  .pipe(csv.parse({ headers: true }))
  .on("data", row => {
    if (row.profesores !== "") {
      Profesores.push(row.profesores);
    }
    if (row.estudiantes !== "") {
      Estudiantes.push(row.estudiantes);
    }
  });

//Create new User
exports.create = (req, res) => {
  let role = "";
  // Request validation
  if (!req.body) {
    return res.status(400).send({
      message: "User content can not be empty"
    });
  }

  if (Estudiantes.indexOf(req.body.email) > -1) {
    role = "estudiantes";
  }

  if (Profesores.indexOf(req.body.email) > -1) {
    role = "profesor";
  }
  console.log(req.body.email);
  console.log(role);

  var User = mongoose.model("User");
  // Create a User
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    role:
      role !== ""
        ? role
        : res.status(500).send({
            message: "Something wrong while creating the User."
          })
  });

  // Save User in the database
  newUser
    .save()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Something wrong while creating the User."
      });
    });
};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
  User.find()
    .then(Users => {
      res.send(Users);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Something wrong while retrieving Users."
      });
    });
};

// Find a single User with a UserId
exports.findOne = (req, res) => {
  console.log(req.params);
  User.findById(req.params.UserId)
    .then(User => {
      if (!User) {
        return res.status(404).send({
          message: "User not found with id " + req.params.UserId
        });
      }
      res.send(User);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "User not found with id " + req.params.UserId
        });
      }
      return res.status(500).send({
        message: "Something wrong retrieving User with id " + req.params.UserId
      });
    });
};

// Find a single User with a UserEmail
exports.findOneEmail = (req, res) => {
  console.log(req.params);
  User.findOne({ email: req.params.UserEmail })
    .then(User => {
      if (!User) {
        return res.status(404).send({
          message: "User not found with email " + req.params.UserEmail
        });
      }
      res.send(User);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "User not found with email " + req.params.UserEmail
        });
      }
      return res.status(500).send({
        message:
          "Something wrong retrieving User with email " + req.params.UserEmail
      });
    });
};

// Update a User
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    return res.status(400).send({
      message: "User content can not be empty"
    });
  }

  // Find and update User with the request body
  User.findByIdAndUpdate(
    req.params.UserId,
    {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role
    },
    { new: true }
  )
    .then(User => {
      if (!User) {
        return res.status(404).send({
          message: "User not found with id " + req.params.UserId
        });
      }
      res.send(User);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "User not found with id " + req.params.UserId
        });
      }
      return res.status(500).send({
        message: "Something wrong updating note with id " + req.params.UserId
      });
    });
};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
  User.findByIdAndRemove(req.params.UserId)
    .then(User => {
      if (!User) {
        return res.status(404).send({
          message: "User not found with id " + req.params.UserId
        });
      }
      res.send({ message: "User deleted successfully!" });
    })
    .catch(err => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "User not found with id " + req.params.UserId
        });
      }
      return res.status(500).send({
        message: "Could not delete User with id " + req.params.UserId
      });
    });
};
