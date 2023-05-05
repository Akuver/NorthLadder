const Sequelize = require("sequelize");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });
console.log(process.env.DB_NAME);
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

const Student = require("./studentModel")(sequelize);
const Subject = require("./subjectModel")(sequelize);
const Mark = require("./markModel")(sequelize);

Student.belongsToMany(Subject, { through: "StudentSubject" });
Subject.belongsToMany(Student, { through: "StudentSubject" });

Mark.belongsTo(Student);
Mark.belongsTo(Subject);

sequelize
  .sync()
  .then(() => {
    console.log("Database and tables created!");
  })
  .catch((error) => {
    console.error("error in sql:", error);
  });

module.exports = {
  Student,
  Subject,
  Mark,
  sequelize,
};
