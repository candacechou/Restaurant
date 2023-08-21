const express = require('express')
const router = express.Router()

const restaurants = require('./restaurant')

router.use('/restaurant', restaurants)
router.get('/', (req, res) => {
  res.render('index')
  res.redirect('/restaurant')
})

module.exports = router