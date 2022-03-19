require("dotenv").config()
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 3000;


app.set('view engine', 'ejs')
app.set("views", path.join(__dirname, 'views'))

async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log(`Connected to the Database!`)
  } catch(e) {
    console.log(`Something went wrong!\n${e}`)
  }

}

app.get('/', (req, res) => {
  res.render('home')
})

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`)
  connect()
})
