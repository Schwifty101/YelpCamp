const { urlencoded } = require('express');
const Review = require('./review');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
})

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    images: [ImageSchema],
    description: String,
    location: String,
    price: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User' 
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review' 
        }
    ]
});

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);