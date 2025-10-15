const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./Review");

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  country: { type: String, required: true },
  price: { type: Number, required: true },
  image: {
    url: { type: String, default: "/images/default.jpg" },
    filename: String,
  },

  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  category: {
    type: String,
    enum: [
      "trending",
      "rooms",
      "cities",
      "mountains",
      "castles",
      "pools",
      "camping",
      "farms",
      "arctic",
      "beach",
    ],
  },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  owner: { type: Schema.Types.ObjectId, ref: "User" },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing && listing.reviews.length > 0) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

module.exports =
  mongoose.models.Listing || mongoose.model("Listing", listingSchema);
