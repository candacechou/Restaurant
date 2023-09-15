const express = require('express')
const router = express.Router()
const passport = require('passport')



router.get('/register', (req, res) => {
  return res.render('register')
})

router.get('/login', (req, res) => {
  return res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/restaurant',
  failureRedirect: '/login',
  failureFlash: true
}))

module.exports = router