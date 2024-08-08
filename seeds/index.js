const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

main().catch(err => console.log(err));

async function main() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp');
        console.log("MONGO CONNECTION OPEN!!!");

        // Call seedDB and addAuthorField functions
        await seedDB();
        await addAuthorField();
    } catch (err) {
        console.log("OH NO MONGO CONNECTION ERROR!!!");
        console.log(err);
    } finally {
        await mongoose.connection.close();
        console.log('MONGO CONNECTION CLOSED');
    }
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
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores aperiam veniam possimus quaerat ea quas suscipit. Consectetur rem impedit ex, blanditiis quia voluptatibus suscipit ut exercitationem id recusandae nulla labore.',
            price,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            images: [
                {
                    url: `https://images.unsplash.com/photo-1494243762909-b498c7e440a9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
                    filename: 'YelpCamp/xbpawfxuz6pce7z1khqo',
                },
                {
                    url: `https://images.unsplash.com/photo-1460751398360-a8d6be9b8208?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fG5pZ2h0JTIwc2t5fGVufDB8MHwwfHx8MA%3D%3D`,
                    filename: 'YelpCamp/f7i8kbnu18id1o7fikip',
                },
                {
                    url: 'https://images.unsplash.com/photo-1435777902907-6ff2bafa0829?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                    filename: 'YelpCamp/ahfnenvca4tha00h2ubt'
                },
                {
                    url: 'https://images.unsplash.com/photo-1509111760872-88f5becad074?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                    filename: 'YelpCamp/ruyoaxgf72nzpi4y6cdi'
                }
            ]
        })
        await camp.save();
    }
}

const authorId = new mongoose.Types.ObjectId('66b1f090d8433ac884097c19');
const addAuthorField = async () => {
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