const express = require("express");
const path = require("path");
const { mongo_url, port } = require("./config.js");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const wrapAsync = require("./utils/catchAsync");
const { CGValidator, ReviewValidator } = require("./validators/all");
const ExpressError = require('./utils/ExpressError');
const app = express();
const PORT = process.env.PORT || 3000;

const Campground = require("./models/campground");
const Review = require("./models/review")

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set("views", path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride('_method'))

async function connect() {
  try {
    await mongoose.connect(mongo_url)
    console.log(`Connected to the Database!`)
  } catch(e) {
    console.log(`Something went wrong!\n${e}`)
  }
}

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

// Test Route
app.get('/', (req, res) => {
  res.render('home')
})

// Show all campgrounds
app.get('/campgrounds', wrapAsync(async (req, res) => {
  const campgrounds = await Campground.find({})
  res.render('campgrounds/index', { campgrounds: campgrounds })
}))

// Create a new campground
app.post('/campgrounds', validateCampground, wrapAsync(async (req, res) => {
  const { campground } = req.body;

  const newCamp = new Campground(campground)
  await newCamp.save()
  res.redirect('/campgrounds')
}))

// Render create campground form
app.get('/campground/new', (req, res) => {
  res.render('campgrounds/new')
})

// Show campground detail
app.get('/campground/:id', wrapAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id).populate('reviews')

  res.render('campgrounds/show', { campground: campground })
}))

//Edit Campground
app.put('/campground/:id', validateCampground, wrapAsync(async (req, res) => {
  const { id } = req.params;

    const response = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true})
    console.log(response)

    res.redirect(`/campground/${id}`)

}))

app.get('/campground/:id/edit', wrapAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)

  res.render('campgrounds/edit', { camp: campground })
}))

app.delete('/campground/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const response = await Campground.findByIdAndDelete(id)
    console.log(response)
    res.redirect(`/campgrounds`)

}))

// Reviews
app.post("/campgrounds/:id/reviews", validateReview, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const { review } = req.body;

  const rv = new Review({ rating: review.rating, body: review.body })
  const camp = await Campground.findById(id)
  camp.reviews.push(rv)
  await rv.save()
  await camp.save()
  res.redirect(`/campground/${id}`)
}))

app.delete('/campgrounds/:id/reviews/:review_id', wrapAsync(async (req, res) => {
  const { id, review_id } = req.params;
  await Review.findByIdAndDelete(review_id)
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: review_id }})
  res.redirect(`/campground/${id}`)
}))

//This will match if nothing above matches
app.all('*', (req, res, next) => {
  next(new ExpressError('Page not found!', 404))
})
//For sync callbacks this will be called instantly without any error but for
// async callbacks we have to wrap them with a function that catches and passes
//the error to the following function since they are not completed instantly
app.use((err, req, res, next) => {
  const { code = 500 } = err;
  if(!err.message) err.message = "Something went wrong!"
  res.status(code).render('error', {err: err})
})

app.listen(port, () => {
  console.log(`Server started at ${port}`)
  connect()
})
