"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    const passwordHash = await bcrypt.hash("123456", 10); 

    await queryInterface.bulkInsert(
      "users",
      [
        {
          name: "Admin User",
          email: "testadmin1@gmail.com",
          role: "admin",
          password: passwordHash,
          refresh_token: null,
          image: "default-images.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Regular User",
          email: "testuser1@gmail.com",
          role: "user",
          password: passwordHash,
          refresh_token: null,
          image: "default-images.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};