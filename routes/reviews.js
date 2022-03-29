const express = require('express');
const router = express.Router({ mergeParams: true});
const { ReviewValidator } = require("../validators/all");
const wrapAsync = require("../utils/catchAsync");
const ExpressError = require('../utils/ExpressError');
const Review = require("../models/review");
const Campground = require("../models/campground");


const validateReview = (req, res, next) => {
  const { error } = ReviewValidator.validate(req.body);

  if(error){
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    // It is crucial to call next if the validation passed cause it will just hangs
    // If we don't
    next();
  }

}

// Reviews
router.post("/", validateReview, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const { review } = req.body;

  const rv = new Review({ rating: review.rating, body: review.body })
  const camp = await Campground.findById(id)
  console.log('ID HERE', id)
  camp.reviews.push(rv)
  await rv.save()
  await camp.save()
  res.redirect(`/campgrounds/${id}`)
}))

router.delete('/:review_id', wrapAsync(async (req, res) => {
  const { id, review_id } = req.params;
  await Review.findByIdAndDelete(review_id)
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: review_id }})
  res.redirect(`/campgrounds/${id}`)
}))


module.exports = router;
