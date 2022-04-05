const express = require("express");
const router = express.Router();
const passport = require("passport");
const user = require("../controllers/user");

router.route('/register')
      .get(user.renderRegisterForm)
      .post(user.register);

router.route('/login')
      .get(user.renderLoginForm)
      .post(passport.authenticate('local',
      {failureFlash: true, failureRedirect: '/users/login'}), user.login);
      
router.get('/logout', user.logout);

module.exports = router;
