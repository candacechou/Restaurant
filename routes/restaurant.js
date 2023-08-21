const express = require('express')
const methodOverride = require('method-override')
const { engine } = require('express-handlebars')

const router = express.Router()

const db = require('../models')
const restaurants = db.Restaurant
router.use(methodOverride('_method'))


router.get('/', (req, res) => {
  let order_option = req.query.order_selection
  let orders = []
  if (order_option === "A->Z") {
    console.log('!')
    orders = ['name', 'ASC']
  }
  else if (order_option === 'Z->A') {
    orders = ['name', 'DESC']

  }
  else if (order_option === '類別') {
    orders = ['category', 'ASC']
  }
  else if (order_option === '地區') {
    orders = ['location', 'ASC']

  }
  else {
    orders = []
  }
  return restaurants.findAll(
    {
      order: [orders],
      attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description'],

      raw: true
    }
  )
    .then((restaurants) => {
      // do sorting ...
      res.render('index', { restaurants, keyword: "", order_selection: req.query.order_selection })
    })
    .catch((err) => res.status(422).json(err))

})
router.delete('/:id', (req, res) => {
  console.log("on app delete")
  const id = req.params.id
  return restaurants.destroy({ where: { id } })
    .then(() => res.redirect('/'))
})

router.get('/new', (req, res) => {
  return res.render('new')
})

router.get('/:id', (req, res) => {
  const id = req.params.id
  return restaurants.findByPk(id, {
    attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description'],
    raw: true
  }).then((restaurant) => res.render('details', { restaurant }))
    .catch((err) => console.log(err))
})


router.post('/', (req, res) => {
  console.log(req.body.name)
  return restaurants.create({
    name: req.body.name,
    name_en: req.body.name_en,
    category: req.body.category,
    image: req.body.image,
    location: req.body.location,
    phone: req.body.phone,
    google_map: req.body.google_map,
    rating: req.body.rating,
    description: req.body.description
  })
    .then(() => res.redirect('/'))
    .catch((err) => console.log(err))
})

router.get('/:id', (req, res) => {
  res.send(`get restaurant: ${req.params.id}`)
})

router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return restaurants.findByPk(id, {
    attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description'],
    raw: true
  })
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch((error) => console.log(error))
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  return restaurants.update({
    name: req.body.name,
    name_en: req.body.name_en,
    category: req.body.category,
    image: req.body.image,
    location: req.body.location,
    phone: req.body.phone,
    google_map: req.body.google_map,
    rating: req.body.rating,
    description: req.body.description
  }, { where: { id } })
    .then(() => res.redirect(`/restaurant/${id}`))
    .catch((err) => console.log(err))
})

module.exports = router;