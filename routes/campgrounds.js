const express = require('express');
const router = express.Router({ params: true });
const campground = require("../controllers/campground");
const { isAuthor, ensureLoggedIn, validateCampground } = require("../middlewares");

router.get('/', campground.index);
router.post('/', ensureLoggedIn, validateCampground, campground.createNew);
router.get('/new', ensureLoggedIn, campground.renderNewForm)
router.get('/:id', campground.show)
router.put('/:id', ensureLoggedIn, isAuthor, validateCampground, campground.edit)
router.get('/:id/edit', ensureLoggedIn, isAuthor, campground.renderEditForm)
router.delete('/:id', ensureLoggedIn, isAuthor, campground.delete)

module.exports = router;
