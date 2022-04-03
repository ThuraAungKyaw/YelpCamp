const Campground = require("./models/campground");
const Review = require("./models/review");
const ExpressError = require('./utils/ExpressError');
const { CGValidator, ReviewValidator } = require("./validators/all");

module.exports.ensureLoggedIn = function(req, res, next){

  if(!req.isAuthenticated()){
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be logged in to do that!")
    return res.redirect('/users/login')
  }
  next();
}

module.exports.isAuthor = async function(req, res, next) {
  const camp = await Campground.findById(req.params.id);
  if(!camp.author.equals(req.user._id)){
    req.flash("error", "You do not have permission to do that!")
    return res.redirect(`/campgrounds/${req.params.id}`)
  }
  next();
}

module.exports.isReviewAuthor = async function(req, res, next) {
  const { review_id, id } = req.params;
  const review = await Review.findById(review_id);
  if(!review.author.equals(req.user._id)){
    req.flash("error", "You do not have permission to do that!")
    return res.redirect(`/campgrounds/${id}`)
  }
  next();
}

module.exports.validateCampground = (req, res, next) => {
  const { error } = CGValidator.validate(req.body);

  if(error){

    console.log(error)
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else{
    // It is crucial to call next if the validation passed cause it will just hangs
    // If we don't
    next();
  }

}

module.exports.validateReview = (req, res, next) => {
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
