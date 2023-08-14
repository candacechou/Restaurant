const express = require('express')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const app = express()
const port = 3000
const { Op } = require('sequelize')
app.use(express.urlencoded({ extended: true }))
// import restaurant json
//const restaurants = require('./public/jsons/restaurant.json').results

// database
const db = require('./models')
const restaurants = db.Restaurant
app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.get('/', (req, res) => {
  res.redirect('/restaurant');
})


app.get('/search', (req, res) => {
  const keyword = req.query.search?.trim()
  if (keyword.length != 0) {
    let stringColumnNames = Object.keys(restaurants.rawAttributes).filter(columnName => {
      const columnType = restaurants.rawAttributes[columnName].type.key;
      return columnType === 'STRING' || columnType === 'TEXT';
    })
    return restaurants.findAll(
      {
        attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description'],
        raw: true,
        where: {
          [Op.or]: stringColumnNames.map(key => ({
            [key]: {
              [Op.like]: "%" + keyword.toLowerCase() + "%"
            }
          }))
        }
      }
    )
      .then((restaurants) => res.render('index', { restaurants, keyword: "" }))
      .catch((err) => res.status(422).json(err))
  }
  else {
    res.redirect('/restaurant')
  }
})

app.get('/restaurant', (req, res) => {
  return restaurants.findAll(
    {
      attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description'],
      raw: true
    }
  )
    .then((restaurants) => res.render('index', { restaurants, keyword: "" }))
    .catch((err) => res.status(422).json(err))

})
app.delete('/restaurant/:id', (req, res) => {
  console.log("on app delete")
  const id = req.params.id
  return restaurants.destroy({ where: { id } })
    .then(() => res.redirect('/restaurant'))
})

app.get('/restaurant/new', (req, res) => {
  return res.render('new')
})
app.get('/restaurant/:id', (req, res) => {
  const id = req.params.id
  return restaurants.findByPk(id, {
    attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description'],
    raw: true
  }).then((restaurant) => res.render('details', { restaurant }))
    .catch((err) => console.log(err))
})


app.post('/restaurant', (req, res) => {
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
    .then(() => res.redirect('/restaurant'))
    .catch((err) => console.log(err))
})

app.get('/restaurant/:id', (req, res) => {
  res.send(`get restaurant: ${req.params.id}`)
})

app.get('/restaurant/:id/edit', (req, res) => {
  const id = req.params.id
  return restaurants.findByPk(id, {
    attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description'],
    raw: true
  })
    .then((restaurant) => res.render('edit', { restaurant }))
    .catch((error) => console.log(error))
})

app.put('/restaurant/:id', (req, res) => {
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



app.listen(port, () => {
  console.log('express server running on <http://localhost>:${port}')
})