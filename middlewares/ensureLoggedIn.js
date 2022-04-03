module.exports = function(req, res, next){

  if(!req.isAuthenticated()){
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be logged in to do that!")
    return res.redirect('/users/login')
  }

  next();

}
