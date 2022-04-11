const mongoose = require('mongoose');
const options = { toJSON: { virtuals: true }, toObject: { virtuals: true } };
const Schema = mongoose.Schema;
const Review = require('./review');

const ImageSchema = new Schema({
  url: String,
  filename: String
})

ImageSchema.virtual('thumbnail').get(function() {
  return this.url.replace('/upload', '/upload/w_200');
})


const CampgroundSchema = new Schema({
  title: {
    type: String
  },
  images:[ImageSchema],
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
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
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    { type: Schema.Types.ObjectId, ref: 'Review'}
  ]
}, options);

CampgroundSchema.virtual('properties.popupMarkup').get(function() {
  const data = {
    id: this._id,
    title: this.title,
    description: `${this.description.substring(0, 45)}...`
  }
  return data;
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
