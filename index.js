const express = require("express");
const path = require("path");
const { mongo_url, port } = require("./config.js");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const app = express();
const PORT = process.env.PORT || 3000;

const Campground = require("./models/campground");

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

// Test Route
app.get('/', (req, res) => {
  res.render('home')
})

// Show all campgrounds
app.get('/campgrounds', async (req, res) => {
  const campgrounds = await Campground.find({})
  res.render('campgrounds/index', { campgrounds: campgrounds })
})

// Create a new campground
app.post('/campgrounds', async (req, res) => {
  const { campground } = req.body;

  const newCamp = new Campground(campground)
  await newCamp.save()
  res.redirect('/campgrounds')
})

// Render create campground form
app.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new')
})

// Show campground detail
app.get('/campground/:id', async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)

  res.render('campgrounds/show', { campground: campground })
})

//Edit Campground
app.put('/campground/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const res = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true})
    console.log(res)
  } catch(e) {
    console.log(e)
  }
  finally {
    res.redirect(`/campground/${id}`)
  }
})

app.get('/campground/:id/edit', async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)

  res.render('campgrounds/edit', { camp: campground })
})

app.delete('/campground/:id', async (req, res) => {
    const { id } = req.params;
  try {
    const res = await Campground.findByIdAndDelete(id)
    console.log(res)
  } catch(e) {
    console.log(e)
  }
  finally {
    res.redirect(`/campgrounds`)
  }
})

app.listen(port, () => {

  console.log(`Server started at ${port}`)
  connect()
})
