const express = require('express')
const router = express.Router()

const passport = require('passport')
const root = require('./root')
const oauth = require('./oauth')
const restaurant = require('./restaurant')
const users = require('./users')
const authHandler = require('../middlewares/auth-handler')


router.use('/', root)
router.use('/restaurant', authHandler, restaurant)
router.use('/users', users)
router.use('/oauth', oauth)

router.get('/', (req, res) => {
  res.redirect('/restaurant')
})

router.get('/register', (req, res) => {
  return res.render('register')
})

router.get('/login', (req, res) => {
  console.log('here')
  return res.render('login')
})


router.post('/login', passport.authenticate('local', {
  successRedirect: '/restaurant',
  failureRedirect: '/login',
  failureFlash: true
}))

router.get('/logout', (req, res, next) => {
  req.logout((error) => {
    if (error) {
      return next(error)
    }
    req.flash('success', 'Logout successfully!')
    return res.redirect('/login')
  })
})


module.exports = router