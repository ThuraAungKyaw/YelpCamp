const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const CampgroundSchema = new Schema({
  title: {
    type: String
  },
  images:[{
    url: String,
    filename: String
  }],
  price: {
    type: Number
  },
  description: {
    type: String
  },
  location: {
    type: String
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    { type: Schema.Types.ObjectId, ref: 'Review'}
  ]
})
//Middleware func to remove associated reviews
CampgroundSchema.post('findOneAndDelete', async function(doc) {
    if(doc && doc.reviews.length !== 0){
      await Review.remove({
        _id: {
          $in: doc.reviews
        }
      })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema)
