const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);

        req.login(registeredUser, err => {
            if (err) return next();
            req.flash('success', 'welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        });

    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.loginUser = (req, res) => {
    req.flash('success', 'Succussfully logged in!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Succussfully Logged Out!');
        res.redirect('/campgrounds');
    });
}