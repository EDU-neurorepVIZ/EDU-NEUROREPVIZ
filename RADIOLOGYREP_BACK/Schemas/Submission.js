const mongoose = require("mongoose");

//edit schema
const SubmissionSchema = mongoose.Schema(
  {
    ownerId: String,
    challengeId: String,
    status: String,
    comment: String
    //entregado, corregido, visto
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Submissions", SubmissionSchema);
