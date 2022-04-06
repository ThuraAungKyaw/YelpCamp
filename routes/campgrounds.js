const express = require('express');
const router = express.Router({ params: true });
const campground = require("../controllers/campground");
const { isAuthor, ensureLoggedIn, validateCampground } = require("../middlewares");
const multer = require("multer");
const { cloudinary, storage } = require("../cloudinary");
const upload = multer({ storage: storage })


router.route('/')
      .get(campground.index)
      .post(ensureLoggedIn, upload.array('image'), validateCampground, campground.createNew);

router.get('/new', ensureLoggedIn, campground.renderNewForm)

router.route('/:id')
      .get(campground.show)
      .put(ensureLoggedIn, isAuthor, validateCampground, campground.edit)
      .delete(ensureLoggedIn, isAuthor, campground.delete)

router.get('/:id/edit', ensureLoggedIn, isAuthor, campground.renderEditForm)


module.exports = router;
