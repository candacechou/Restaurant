const express = require('express')
const { engine } = require('express-handlebars')
const app = express()
const port = 3000
const { Op } = require('sequelize')

// import restaurant json
//const restaurants = require('./public/jsons/restaurant.json').results

// database
const db = require('./models')
const restaurants = db.Restaurant
app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))



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
app.get('/restaurant/:id', (req, res) => {
  const id = req.params.id
  return restaurants.findByPk(id, {
    attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description'],
    raw: true
  }).then((restaurant) => res.render('details', { restaurant }))
    .catch((err) => console.log(err))
})


app.get('/restaurant/new', (req, res) => {
  res.send('create restaurant')
})

app.post('/restaurant', (req, res) => {
  res.send('add restaurant')
})

app.get('/restaurant/:id', (req, res) => {
  res.send(`get restaurant: ${req.params.id}`)
})

app.get('/restaurant/:id/edit', (req, res) => {
  res.send(`get restaurant edit: ${req.params.id}`)
})

app.put('/restaurant/:id', (req, res) => {
  res.send('modify restaurant')
})

app.delete('/restaurant/:id', (req, res) => {
  res.send('delete restaurant')
})

app.listen(port, () => {
  console.log('express server running on <http://localhost>:${port}')
})