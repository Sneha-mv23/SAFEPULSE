// model/report.js
const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  activity: String,
  location: String,
  lat: Number,
  lng: Number,
  timestamp: Date,
});

module.exports = mongoose.model("Report", reportSchema);
