const express = require("express");
const router = express.Router();
const passport = require("passport");
const user = require("../controllers/user");

router.get('/register', user.renderRegisterForm);
router.post('/register', user.register);
router.get('/login', user.renderLoginForm);
router.post('/login', passport.authenticate('local',
{failureFlash: true, failureRedirect: '/users/login'}), user.login)
router.get('/logout', user.logout);

module.exports = router;
