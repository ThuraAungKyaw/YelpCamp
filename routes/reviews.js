const express = require('express');
const router = express.Router({ mergeParams: true});
const { isReviewAuthor, ensureLoggedIn, validateReview } = require("../middlewares");
const review = require("../controllers/review");

router.post("/", ensureLoggedIn, validateReview, review.create)
router.delete('/:review_id', ensureLoggedIn, isReviewAuthor, review.delete)

module.exports = router;
