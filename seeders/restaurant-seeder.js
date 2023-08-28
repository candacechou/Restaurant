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
    let transaction
    let users = {};
    await Promise.all(user.results.map(async (person, index, array) => {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(person.password, salt);
      person.password = hash;
      users[person.id] = person.collection;
      delete array[index]['collection']
    }));
    transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkInsert('Users', user.results, { transaction });
      await Promise.all(sample.results.map(async (restaurant, index, array) => {
        let new_id = 0
        for (let i = 0; i < Object.keys(users).length; i++) {
          let key = Object.keys(users)[i]
          if (users[key].indexOf(array[index].id) !== -1) {
            new_id = parseInt(key)
          }
        }
        array[index].userId = new_id
      }));
      // insert restaurant
      await queryInterface.bulkInsert('restaurants', sample.results, { transaction });
      // Commit the transaction
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.log(error)
    }

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

