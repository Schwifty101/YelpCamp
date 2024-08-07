const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp')
        .then(() => {
            console.log("MONGO CONNECTION OPEN!!!");
        }).catch((err) => {
            console.log("OH NO MONGO CONNECTION ERROR!!!");
            console.log(err);
        });
}

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', () => {
    console.log('database connected');
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 40 + 20);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}, ${i}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores aperiam veniam possimus quaerat ea quas suscipit. Consectetur rem impedit ex, blanditiis quia voluptatibus suscipit ut exercitationem id recusandae nulla labore.',
            price
        })
        await camp.save();
    }
}
// seedDB();
const authorId = new mongoose.Types.ObjectId('66b1f090d8433ac884097c19');
const addAuthorField = async() => {
    try {
        const campgrounds = await Campground.find({});
        for (const camp of campgrounds) {
            camp.author = authorId;
            await camp.save();
        }

        console.log('All campgrounds updated successfully!');
    } catch (err) {
        console.error('Error updating campgrounds:', err);
    } 
}

// addAuthorField();