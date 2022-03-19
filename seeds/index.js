const { mongo_url } = require('../config.js');
const mongoose = require("mongoose");
const Campground = require("../models/campground");


async function connect() {
  try {

    await mongoose.connect(mongo_url)
    console.log(`Connected to the Database!`)
  } catch(e) {
    console.log(`Something went wrong!\n${e}`)
  }

}

connect()
const seedDB = async () => {
  await Campground.deleteMany({});
  const c = new Campground({title: 'Purple Field'})
  await c.save()
  console.log('DONE')
}

seedDB()
