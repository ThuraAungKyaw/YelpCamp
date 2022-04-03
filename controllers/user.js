const User = require("../models/user");
const wrapAsync = require("../utils/catchAsync");


module.exports.renderRegisterForm = (req, res) => {
  res.render('users/register')
}


module.exports.renderLoginForm = (req, res) => {
  res.render("users/login")
}


module.exports.register = wrapAsync(async (req, res) => {

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

module.exports.login = (req, res) => {
  req.flash('success', "Welcome Back!")
  const redirectUrl = req.session.returnTo || '/campgrounds'
  delete req.session.returnTo;
  res.redirect(redirectUrl)
}

module.exports.logout = (req, res) => {
 req.logout()
 req.flash('success', "Logged out!")
 res.redirect('/campgrounds')
}
