const express = require("express");
const path = require("path");
const {mongo_url, port } = require("./config.js");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 3000;

const Campground = require("./models/campground");

app.set('view engine', 'ejs')
app.set("views", path.join(__dirname, 'views'))

async function connect() {
  try {
    await mongoose.connect(mongo_url)
    console.log(`Connected to the Database!`)
  } catch(e) {
    console.log(`Something went wrong!\n${e}`)
  }

}

app.get('/', (req, res) => {
  res.render('home')
})

app.listen(port, () => {

  console.log(`Server started at ${port}`)
  connect()
})
