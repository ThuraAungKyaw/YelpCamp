const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const CampGroundSchema = new Schema({
  title: {
    type: String
  },
  image: {
    type: String
  },
  price: {
    type: Number
  },
  description: {
    type: String
  },
  location: {
    type: String
  },
  reviews: [
    { type: Schema.Types.ObjectId, ref: 'Review'}
  ]
})
//Middleware func to remove associated reviews
CampGroundSchema.post('findOneAndDelete', async function(doc) {
    if(doc && doc.reviews.length !== 0){
      await Review.remove({
        _id: {
          $in: doc.reviews
        }
      })
    }
})

module.exports = mongoose.model('Campground', CampGroundSchema)
