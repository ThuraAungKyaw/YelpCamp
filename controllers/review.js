const Review = require("../models/review");
const Campground = require("../models/campground");
const wrapAsync = require("../utils/catchAsync");

// Create a new review
module.exports.create = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const { review } = req.body;

  const rv = new Review({ rating: review.rating, body: review.body, author: req.user._id })
  const camp = await Campground.findById(id)

  camp.reviews.push(rv)
  await rv.save()
  await camp.save()
  req.flash("success", "Review added successfully!")
  res.redirect(`/campgrounds/${id}`)
})

// Delete a review
module.exports.delete =  wrapAsync(async (req, res) => {
  const { id, review_id } = req.params;
  await Review.findByIdAndDelete(review_id)
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: review_id }})
  req.flash("success", "Review deleted successfully!")
  res.redirect(`/campgrounds/${id}`)
})
