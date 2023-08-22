module.exports = (error, req, res, next) => {
  req.flash('error', error.errorMessage || 'error-occurs')
  res.redirect('back')
  next(error)
}