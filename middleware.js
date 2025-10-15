const Listing = require("./models/Listing");
const Review = require("./models/Review");
const { reviewSchema } = require("./Schema.js");
const ExpressError = require("./utils/ExpressError");
const { listingSchema } = require("./Schema.js");

module.exports.validateListing = (req, res, next) => {
  if (!req.body.listing) {
    const listingObj = {};
    for (let key in req.body) {
      const match = key.match(/^listing\[(.+)\]$/);
      if (match) {
        listingObj[match[1]] = req.body[key];
      }
    }
    if (Object.keys(listingObj).length > 0) {
      req.body.listing = listingObj;
    }
  }

  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errmsg);
  } else next();
};

module.exports.safeValidateListing = (req, res, next) => {
  try {
    module.exports.validateListing(req, res, next);
  } catch (err) {
    console.error("❌ Validation Error:", err.message);
    next(err);
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);

  if (error) {
    let errmsg = error.details.map((el) => el.message).join(", ");

    throw new ExpressError(400, errmsg);
  } else {
    next();
  }
};

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in first!");
    return res.redirect("/login");
  }

  if (req.query.returnTo) {
    console.log(req.query.returnTo);
    req.session.redirectUrl = req.query.returnTo;
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session && req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  const ownerId = listing.owner?._id?.toString() || listing.owner.toString();
  if (ownerId !== req.user._id.toString()) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { reviewId, id } = req.params;
  const review = await Review.findById(reviewId);
  if (!review) {
    req.flash("error", "Review not found!");
    return res.redirect(`/listings/${id}`);
  }

  const authorId = review.author?._id?.toString() || review.author.toString();
  if (authorId !== req.user._id.toString()) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};
