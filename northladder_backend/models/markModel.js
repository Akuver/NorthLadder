const Sequelize = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("mark", {
    value: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
  });
};
