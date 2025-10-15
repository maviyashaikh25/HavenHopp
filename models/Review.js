const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  rating: { type: Number, min: 1, max: 5, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  comment: { type: String },
});

module.exports =
  mongoose.models.Review || mongoose.model("Review", reviewSchema);
