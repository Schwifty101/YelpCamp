const express = require('express');
const router = express.Router({ mergeParams: true });
const campgrounds = require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const { validateCampground, isLoggedIn, isAuthor } = require('../middleware');


router.get('/', catchAsync(campgrounds.index));

router.get('/new', isLoggedIn, campgrounds.renderCampgroundForm);

router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createNewCampground))

router.get('/:id', catchAsync(campgrounds.renderCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;