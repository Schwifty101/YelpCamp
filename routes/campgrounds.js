const express = require('express');
const router = express.Router({ mergeParams: true });
const multer = require('multer');
const { storage } = require('../cloudinary')
const upload = multer({ storage });
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const { validateCampground, isLoggedIn, isAuthor } = require('../middleware');


router.get('/', catchAsync(campgrounds.index));

router.get('/new', isLoggedIn, campgrounds.renderCampgroundForm);

// router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createNewCampground))
router.post('/', upload.array('image'), (req, res) => {
    // Send the uploaded file and form data back in the response
    // res.send({ body: req.body, files: req.files });
    console.log(req.body, req.files);
    res.send('IT WORKED');
});


router.get('/:id', catchAsync(campgrounds.renderCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;