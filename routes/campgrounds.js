const express = require('express');
const router = express.Router({ params: true });
const Campground = require("../models/campground");
const wrapAsync = require("../utils/catchAsync");
const { isAuthor, ensureLoggedIn, validateCampground } = require("../middlewares");

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
  const campground = await Campground.findById(id)
  .populate({ path: 'reviews',
  populate: { path: 'author'}}).populate('author')

  if(!campground){
    req.flash('error', "Campground not found!");
    return res.redirect('/campgrounds')
  }
  res.render('campgrounds/show', { campground: campground })
}))

//Edit Campground
router.put('/:id', ensureLoggedIn, isAuthor, validateCampground, wrapAsync(async (req, res) => {
  const { id } = req.params;

    const response = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true})
    console.log(response)
    req.flash("success", "Campground edited successfully!")

    res.redirect(`/campgrounds/${id}`)

}))

router.get('/:id/edit', ensureLoggedIn, isAuthor, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
  if(!campground){
    req.flash('error', "Campground not found!");
    return res.redirect('/campgrounds')
  }
  res.render('campgrounds/edit', { camp: campground })
}))

router.delete('/:id', ensureLoggedIn, isAuthor, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const response = await Campground.findByIdAndDelete(id)
    req.flash("success", "Campground deleted successfully!")
    res.redirect(`/campgrounds`)

}))


module.exports = router;
