const express = require('express');
const router = express.Router();
const { CGValidator } = require("../validators/all");
const wrapAsync = require("../utils/catchAsync");
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
router.post('/', validateCampground, wrapAsync(async (req, res) => {
  const { campground } = req.body;

  const newCamp = new Campground(campground)
  await newCamp.save()
  res.redirect('/campgrounds')
}))

// Render create campground form
router.get('/new', (req, res) => {
  res.render('campgrounds/new')
})

// Show campground detail
router.get('/:id', wrapAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id).populate('reviews')

  res.render('campgrounds/show', { campground: campground })
}))

//Edit Campground
router.put('/:id', validateCampground, wrapAsync(async (req, res) => {
  const { id } = req.params;

    const response = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true})
    console.log(response)

    res.redirect(`/campgrounds/${id}`)

}))

router.get('/:id/edit', wrapAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)

  res.render('campgrounds/edit', { camp: campground })
}))

router.delete('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const response = await Campground.findByIdAndDelete(id)
    res.redirect(`/campgrounds`)

}))


module.exports = router;
