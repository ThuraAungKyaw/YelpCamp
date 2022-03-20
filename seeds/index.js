const { mongo_url } = require('../config.js');
const mongoose = require("mongoose");
const { descriptors, places } = require('./seedHelpers.js')
const cities = require("./cities.js")
const Campground = require("../models/campground");



async function connect() {
  try {

    await mongoose.connect(mongo_url)
    console.log(`Connected to the Database!`)
  } catch(e) {
    console.log(`Something went wrong!\n${e}`)
  }

}

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)]

connect()
const seedDB = async () => {
  await Campground.deleteMany({});
  for(let i=0;i < 50;i++){
    const c = new Campground({
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[i].city}, ${cities[i].state}`
    })
    await c.save()
  }

  console.log('DONE')
}

seedDB().then(() => {
  mongoose.connection.close();
})
