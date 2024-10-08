const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary/index')

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    // campgrounds.forEach(campground => {
    //     console.log('Campground images:', campground.images);
    // });
    res.render('campgrounds/index', { title: "Campgrounds", campgrounds });
};

module.exports.renderCampgroundForm = (req, res) => {
    res.render("campgrounds/new");
};

module.exports.createNewCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    // console.log(campground);
    req.flash('success', 'Succussfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`)
};

module.exports.renderCampground = async (req, res) => {
    try {
        const campground = await Campground.findById(req.params.id).populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        }).populate('author');

        if (!campground) {
            req.flash('error', 'Campground does not exist');
            return res.redirect('/campgrounds');
        }
        res.render("campgrounds/show", { campground });
    } catch (error) {
        console.error('Error rendering campground:', error);
        req.flash('error', 'An error occurred.');
        res.redirect('/campgrounds');
    }
};

module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Campground does not exist');
        return res.redirect('/campgrounds');
    }
    res.render("campgrounds/edit", { campground });
}

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    // console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { new: true });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        // console.log(campground);
    }
    req.flash('success', 'Succesfully updated the campground');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Succesfully deleted the campground');
    res.redirect('/campgrounds');
}