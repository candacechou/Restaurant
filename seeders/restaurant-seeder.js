'use strict';
const bcrypt = require('bcryptjs')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    const sample = require('../public/jsons/restaurant.json');
    const user = require('../public/jsons/user.json')
    let users = {};
    await Promise.all(user.results.map(async (person, index, array) => {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(person.password, salt);
      person.password = hash;
      users[person.id] = person.collection;
      delete array[index]['collection']
    }));

    await queryInterface.bulkInsert('Users', user.results, {});

    sample.results.forEach(function (element, index, array) {
      let new_id = 0
      for (let i = 0; i < Object.keys(users).length; i++) {
        let keysname = Object.keys(users)[i]
        if (users[keysname].indexOf(array[index].id) !== -1) {
          new_id = parseInt(keysname)
        }
      }
      array[index].userId = new_id

    })

    await queryInterface.bulkInsert('restaurants', sample.results, {});


  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('restaurants', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }

}

