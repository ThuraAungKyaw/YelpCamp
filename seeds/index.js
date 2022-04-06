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
    const price = Math.floor(Math.random() * 20) + 10;
    const c = new Campground({
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[i].city}, ${cities[i].state}`,
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      price: price,
      images:  [
  {
    url: 'https://res.cloudinary.com/dgntfi7ql/image/upload/v1649267279/YelpCamp/dvsnts0exe26di4jx7gz.jpg',
    filename: 'YelpCamp/dvsnts0exe26di4jx7gz'
  },
  {
    url: 'https://res.cloudinary.com/dgntfi7ql/image/upload/v1649267279/YelpCamp/egipnzdg2jgjrqyzjahr.jpg',
    filename: 'YelpCamp/egipnzdg2jgjrqyzjahr'
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
