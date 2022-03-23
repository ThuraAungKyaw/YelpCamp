module.exports = function(fn) {
  return function(res, req, next) {
    fn(res, req, next).catch(next)
  }
}
