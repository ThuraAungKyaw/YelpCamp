const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");

router.get('/register', (req, res) => {
  res.render('users/register')
})

router.post('/register', async (req, res) => {

  try {
    const { username, password, email } = req.body;
    const newUser = new User({
      email: email,
      username: username
    })

    const registeredUser = await User.register(newUser, password)
    req.login(registeredUser, err => {
      if(err) return next(err);

      req.flash('success', `Welcome to Yelp Camp, ${req.user.username}!`)
      res.redirect('/campgrounds')
    })

  } catch(e) {
    req.flash('error', e.message)
    res.redirect('/users/register')
  }


})

router.get('/login', (req, res) => {
  res.render("users/login")
})

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/users/login'}), (req, res) => {
  req.flash('success', "Welcome Back!")
  const redirectUrl = req.session.returnTo || '/campgrounds'
  delete req.session.returnTo;
  res.redirect(redirectUrl)
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success', "Logged out!")
  res.redirect('/campgrounds')
})




module.exports = router;
