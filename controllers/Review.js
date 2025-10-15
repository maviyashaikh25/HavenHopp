const Listing = require("../models/Listing.js");
const Review = require("../models/Review.js");

module.exports.createReview = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  const newReview = new Review(req.body.review);
  console.log(req.body.review);

  newReview.author = req.user._id;
  await newReview.save();
  listing.reviews.push(newReview._id);
  await listing.save();

  req.flash("success", "New review added");
  res.redirect(`/listings/${req.params.id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted");
  res.redirect(`/listings/${id}`);
};
