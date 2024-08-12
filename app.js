if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

// Core Modules
const path = require('path');

// External Packages
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');

// Local Modules
const ExpressError = require('./utils/expressErrors');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users')
const User = require('./models/user');

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

const app = express();
app.engine('ejs', ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
const sessionConfig = {
    secret: 'notsosecretkeyisit?',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
app.use(mongoSanitize());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);

// Methods
app.get('/', (req, res) => {
    res.render('home');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = 'Oh No! Something went wrong';
    res.status(status).render('error', { err });
})

app.listen(3000, () => {
    console.log('serving on port 3000');
});