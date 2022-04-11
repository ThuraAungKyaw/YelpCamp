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
  for(let i=0;i < 271;i++){
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const c = new Campground({
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      price: price,
      geometry: {
        type: "Point",
        coordinates: [cities[random1000].longitude, cities[random1000].latitude]
      },
      images:  [
  {
    url: 'https://res.cloudinary.com/dgntfi7ql/image/upload/v1649315150/YelpCamp/mchvsiqfrrvewkcuy37g.jpg',
    filename: 'YelpCamp/mchvsiqfrrvewkcuy37g'
  },
  {
    url: 'https://res.cloudinary.com/dgntfi7ql/image/upload/v1649310902/YelpCamp/ur5rsevabwgknmkof2y9.jpg',
    filename: 'YelpCamp/ur5rsevabwgknmkof2y9'
  }
],
      author: '624801ca2bb4ecec186b4b58'
    })
    await c.save()
  }

  console.log('DONE')
}

seedDB().then(() => {
  mongoose.connection.close();
})
