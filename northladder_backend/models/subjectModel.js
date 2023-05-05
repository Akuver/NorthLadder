const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("subject", {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
  });
};
