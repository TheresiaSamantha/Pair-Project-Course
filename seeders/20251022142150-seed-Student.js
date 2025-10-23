'use strict';
const fs = require("fs").promises;
const bcrypt = require('bcryptjs') 
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let data = JSON.parse(await fs.readFile("./data/students.json", "utf8")).map((el) => {
      delete el.id;
      el.createdAt = new Date();
      el.updatedAt = new Date();
      const salt = bcrypt.genSaltSync(8); // proses hash 8 kali
      const hash = bcrypt.hashSync(el.password, salt);
      el.password = hash
      return el;
    });
    await queryInterface.bulkInsert("Students", data);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Students", null, {});
  }
};
