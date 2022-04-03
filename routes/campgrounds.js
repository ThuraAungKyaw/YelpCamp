const express = require('express');
const router = express.Router();
const { CGValidator } = require("../validators/all");
const wrapAsync = require("../utils/catchAsync");
const ensureLoggedIn = require("../middlewares/ensureLoggedIn");
const ExpressError = require('../utils/ExpressError');
const Campground = require("../models/campground");

const validateCampground = (req, res, next) => {
  const { error } = CGValidator.validate(req.body);

  if(error){
    // ***
     console.log(error)
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else{
    // It is crucial to call next if the validation passed cause it will just hangs
    // If we don't
    next();
  }

}

// Show all campgrounds
router.get('/', wrapAsync(async (req, res) => {
  const campgrounds = await Campground.find({})
  res.render('campgrounds/index', { campgrounds: campgrounds })
}))

// Create a new campground
router.post('/', ensureLoggedIn, validateCampground, wrapAsync(async (req, res) => {
  const { campground } = req.body;

  const newCamp = new Campground(campground)
  newCamp.author = req.user._id;
  await newCamp.save()
  req.flash("success", "Successfully created a new campground!")
  res.redirect('/campgrounds')
}))

// Render create campground form
router.get('/new', ensureLoggedIn, (req, res) => {
  res.render('campgrounds/new')
})

// Show campground detail
router.get('/:id', wrapAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id).populate('reviews').populate('author')

  if(!campground){
    req.flash('error', "Campground not found!");
    return res.redirect('/campgrounds')
  }
  res.render('campgrounds/show', { campground: campground })
}))

//Edit Campground
router.put('/:id', ensureLoggedIn, validateCampground, wrapAsync(async (req, res) => {
  const { id } = req.params;

    const response = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true})
    console.log(response)
    req.flash("success", "Campground edited successfully!")

    res.redirect(`/campgrounds/${id}`)

}))

router.get('/:id/edit', ensureLoggedIn, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
  if(!campground){
    req.flash('error', "Campground not found!");
    return res.redirect('/campgrounds')
  }
  res.render('campgrounds/edit', { camp: campground })
}))

router.delete('/:id', ensureLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const response = await Campground.findByIdAndDelete(id)
    req.flash("success", "Campground deleted successfully!")
    res.redirect(`/campgrounds`)

}))


module.exports = router;