const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("student", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
  });
};
