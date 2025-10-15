const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../Schema.js");
const ExpressError = require("../utils/ExpressError.js");
const {
  isLoggedIn,
  isOwner,
  validateListing,
  safeValidateListing,
} = require("../middleware.js");
const listings = require("../controllers/Listing.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router.get("/search", wrapAsync(listings.searchListings));
router
  .route("/")
  .get(wrapAsync(listings.index))
  .post(
    isLoggedIn,
    upload.single("image"),
    safeValidateListing,
    wrapAsync(listings.createListing)
  );

router.get("/new", isLoggedIn, listings.createListingForm);

router
  .route("/:id")
  .get(wrapAsync(listings.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("image"),
    validateListing,
    wrapAsync(listings.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listings.deleteListing));

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listings.editListingForm)
);

module.exports = router;
