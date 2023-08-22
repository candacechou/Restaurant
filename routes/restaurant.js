const express = require('express')
const router = express.Router()

const db = require('../models')
const restaurants = db.Restaurant

//default
let order_option = "A->Z"
let page = 1
let limit = 3


router.get('/search', (req, res) => {
  const keyword = req.query.search?.trim()
  // page 
  if (req.query.order_selection) {
    order_option = req.query.order_selection
    page = 1
  }
  if (keyword.length != 0) {
    let stringColumnNames = Object.keys(restaurants.rawAttributes).filter(columnName => {
      const columnType = restaurants.rawAttributes[columnName].type.key;
      return columnType === 'STRING' || columnType === 'TEXT';
    })
    return restaurants.findAll(
      {
        attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description'],
        raw: true,
        offset: (page - 1) * limit,
        limit: limit,
        where: {
          [Op.or]: stringColumnNames.map(key => ({
            [key]: {
              [Op.like]: "%" + keyword.toLowerCase() + "%"
            }
          }))
        }
      }
    )
      .then((restaurants) => {
        if ((restaurants.length) > limit) {
          page = page - 1
        }
        res.render('index', {
          restaurants: restaurants,
          prev: page > 1 ? page - 1 : page,
          next: page + 1,
          page: page,
          keyword: keyword,
          order_selection: order_option
        })
      })
      .catch((err) => res.status(422).json(err))
  }
  else {
    res.redirect('/restaurant')
  }
})



router.get('/', (req, res) => {
  if (req.query.order_selection) {
    order_option = req.query.order_selection
    page = 1
  }

  let orders = []
  if (order_option === "A->Z") {
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
  // page
  if (req.query.page) {
    page = parseInt(req.query.page)
  }
  else {
    page = 1
  }


  return restaurants.findAll(
    {
      order: [orders],
      attributes: ['id', 'name', 'name_en', 'category', 'image', 'location', 'phone', 'google_map', 'rating', 'description'],
      offset: (page - 1) * limit,
      limit: limit,
      raw: true
    }
  )
    .then((restaurants) => {
      // do sorting ...
      // sort
      if (restaurants.length === 0) {
        page = page - 1
      }
      else {
        res.render('index', {
          restaurants: restaurants,
          prev: page > 1 ? page - 1 : page,
          next: page + 1,
          page: page,
          keyword: "",
          order_selection: order_option
        })
      }

    })
    .catch((error) => {
      error.errorMessage = '資料取得失敗:('
      next(error)
    })

})
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return restaurants.destroy({ where: { id } })
    .then(() => {
      console.log("!!")
      req.flash('success', 'Successfully delete the Restaurant!')
      return res.redirect('/restaurant')
    })
    .catch((error) => {
      error.errorMessage = '刪除失敗:('
      next(error)
    })
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
    .then(() => {
      console.log("!")
      req.flash('success', 'Successfully Add new Restaurant!')
      return res.redirect('/restaurant')
    })
    .catch((error) => {
      error.errorMessage = ' Failed to Add new Restaurant!'
      next(error)
      res.redirect('back')
    })
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
    .catch((error) => {
      error.errorMessage = '資料取得失敗:('
      next(error)
    })
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
    .then(() => {
      req.flash('success', "Successfully Edit the Restaurant!")
      return res.redirect(`/restaurant/${id}`)
    }
    )
    .catch((error) => {
      error.errorMessage = 'Failed to  Edit the Restaurant!'
      next(error)
    })
})

module.exports = router;