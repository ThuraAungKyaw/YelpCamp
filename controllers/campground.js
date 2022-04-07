const Campground = require("../models/campground");
const wrapAsync = require("../utils/catchAsync");
const { cloudinary } = require("../cloudinary");
// Show all campgrounds
module.exports.index = wrapAsync(async (req, res) => {
  const campgrounds = await Campground.find({})
  res.render('campgrounds/index', { campgrounds: campgrounds })
})

// Create a new campground
module.exports.createNew = wrapAsync(async (req, res) => {
  const { campground } = req.body;
  const images = req.files.map(f => ({ url: f.path, filename: f.filename }))

  const newCamp = new Campground(campground)
  newCamp.images = images;
  newCamp.author = req.user._id;
  await newCamp.save()
  console.log(campground)
  req.flash("success", "Successfully created a new campground!")
  res.redirect('/campgrounds')
})

// Render create campground form
module.exports.renderNewForm = (req, res) => {
  res.render('campgrounds/new')
}

// Render edit campground form
module.exports.renderEditForm = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
  if(!campground){
    req.flash('error', "Campground not found!");
    return res.redirect('/campgrounds')
  }
  res.render('campgrounds/edit', { camp: campground })
})

// Show campground detail
module.exports.show = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
  .populate({ path: 'reviews',
  populate: { path: 'author'}}).populate('author')

  if(!campground){
    req.flash('error', "Campground not found!");
    return res.redirect('/campgrounds')
  }
  res.render('campgrounds/show', { campground: campground })
})

//Edit Campground
module.exports.edit = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const { campground: camp } = req.body;

  const campground = await Campground.findByIdAndUpdate(id, {...camp}, {new: true})
  const images = req.files.map(f => ({ url: f.path, filename: f.filename }))
  campground.images.push(...images)
  await  campground.save();

  if(req.body.deleteImages){
    for(let image of req.body.deleteImages) {
      await cloudinary.uploader.destroy(image)
    }
    await campground.updateOne({ $pull: { images: { filename: {  $in: req.body.deleteImages } }}})
  }

  req.flash("success", "Campground edited successfully!")

  res.redirect(`/campgrounds/${id}`)

})

//Delete Campground
module.exports.delete = wrapAsync(async (req, res) => {
    const { id } = req.params;
    const response = await Campground.findByIdAndDelete(id)
    req.flash("success", "Campground deleted successfully!")
    res.redirect(`/campgrounds`)

})
