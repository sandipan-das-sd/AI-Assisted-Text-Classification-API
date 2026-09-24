const mongoose = require("mongoose");
const classificationSchema = new mongoose.Schema({
  text: { type: String, required: true },
  category: { type: String, enum: ["Complaint", "Query", "Feedback", "Other"], required: true },
  confidence: { type: Number, min: 0, max: 1, required: true },
}, { timestamps: true });
module.exports = mongoose.model("Classification", classificationSchema);
