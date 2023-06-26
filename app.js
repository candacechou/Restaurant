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


app.get('/restaurant', (req, res) => {
  res.render('index', { restaurants })
})

app.listen(port, () => {
  console.log('express server running on <http://localhost>:${port}')
})