'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const sample = require('../public/jsons/restaurant.json');
    const user = require('../public/jsons/user.json');
    let users = {}
    // Hash passwords using bcrypt
    await Promise.all(user.results.map(async (person) => {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(person.password, salt);
      person.password = hash;
      person.collection.forEach((ids) => { users[ids] = person.id; })
      delete person.collection;
    }));

    try {
      console.log(user.results)
      // Insert users
      await queryInterface.bulkInsert('Users', user.results, {});
      console.log("done user")
    } catch (error) {
      console.error("Error inserting users:", error);
    }

    // Associate users with restaurants and insert restaurants
    sample.results.forEach((restaurant, index, array) => {
      if (users.hasOwnProperty(restaurant.id)) {
        array[index].userId = users[restaurant.id]
      }
      else {
        array[index].userId = 0
      }
    });
    console.log(sample.results)

    await queryInterface.bulkInsert('Restaurants', sample.results, {});

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Restaurants', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};
