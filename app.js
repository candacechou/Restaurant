const express = require('express')
const { engine } = require('express-handlebars')
const app = express()
const port = 3000

// import restaurant json
const restaurants = require('./public/jsons/restaurant.json').results


app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))



app.get('/', (req, res) => {
  res.redirect('/restaurant');
})


app.get('/search', (req, res) => {
  const keyword = req.query.search?.trim()
  if (keyword.length !== 0) {
    const MatchedRestaurant = restaurants.filter((rest) => Object.values(rest).some((property) => {
      if (typeof property === 'string') {
        return property.toLowerCase() === keyword.toLowerCase()
      }
    }))
    res.render('index', { restaurants: MatchedRestaurant, keyword })
  }
  else {
    res.redirect('/restaurant')
  }

})

app.get('/restaurant', (req, res) => {
  res.render('index', { restaurants, keyword: "" })

})
app.get('/restaurant/:id', (req, res) => {
  const id = req.params.id
  const restaurant = restaurants.find((mv) => mv.id.toString() === id)
  res.render('details', { restaurant })
})

app.listen(port, () => {
  console.log('express server running on <http://localhost>:${port}')
})