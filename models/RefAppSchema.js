const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  ref: { type: mongoose.Types.ObjectId },
  name: String,
  url: [String],
});

module.exports = mongoose.model("RefApp", Schema, "RefApp");
