const express = require('express')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')

const router = require('./routes')
const app = express()
const port = 3000
const { Op } = require('sequelize')
app.use(express.urlencoded({ extended: true }))
const db = require('./models')
const restaurants = db.Restaurant
// import restaurant json
//const restaurants = require('./public/jsons/restaurant.json').results
app.use(router)
// database

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
      .then((restaurants) => res.render('index', { restaurants, keyword }))
      .catch((err) => res.status(422).json(err))
  }
  else {
    res.redirect('/restaurant')
  }
})




app.listen(port, () => {
  console.log('express server running on <http://localhost>:${port}')
})