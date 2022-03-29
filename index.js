const express = require("express");
const path = require("path");
const { mongo_url, port } = require("./config.js");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const wrapAsync = require("./utils/catchAsync");
const ExpressError = require('./utils/ExpressError');
const app = express();
const PORT = process.env.PORT || 3000;
const campRouter = require('./routes/campgrounds');
const reviewRouter = require('./routes/reviews');

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set("views", path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


// Test Route
app.get('/', (req, res) => {
  res.render('home')
})

app.use('/campgrounds', campRouter);
app.use('/campgrounds/:id/reviews', reviewRouter)

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

async function connect() {
  try {
    await mongoose.connect(mongo_url)
    console.log(`Connected to the Database!`)
  } catch(e) {
    console.log(`Something went wrong!\n${e}`)
  }
}



app.listen(port, () => {
  console.log(`Server started at ${port}`)
  connect()
})
