const { sequelize } = require("../models/db");
const Subject = require("../models/subjectModel");
const Student = require("../models/studentModel");
const Mark = require("../models/markModel");
const axios = require("axios");

function getSchema() {
  const schemaString = `We define three Sequelize models named "mark", "student", and "subject". The "mark" model has a "value" attribute of type FLOAT and is not nullable. The "student" model has "name" attribute of type STRING, and is not nullable, and email is a unique field. The "subject" model has a "name" attribute of type STRING which is not nullable and is a unique field.
  There is a many-to-many relationship between "student" and "subject" models, which is defined by a join table named "StudentSubject". The "mark" model belongs to both "student" and "subject" models.`;
  return schemaString;
}

exports.getSQLQuery = async (req, res, next) => {
  const inputText = req.query.inputText;
  const databaseSchema = getSchema();
  const model = "text-davinci-002"; // the GPT-3 model you want to use
  const prompt = `Provide a SQL query to retrieve the data from the following schema: ${databaseSchema}. Given the following input: ${inputText}\n`;
  const apiUrl = `https://api.openai.com/v1/models/${model}/completions`;

  // make the request to OpenAI API
  axios
    .post(
      apiUrl,
      {
        prompt,
        max_tokens: 100, // the maximum number of tokens to generate
        n: 1, // the number of responses to generate
        temperature: 0.5, // the temperature of the sampling distribution
        stop: null, // the stop sequence for text generation
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    )
    .then((response) => {
      req.query.sqlQuery = response.data.choices[0].text.trim();
      console.log(response.data.choices[0].text); // log the generated text
      next();
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: error });
    });
};

exports.executeSQLQuery = (req, res, next) => {
  const sqlQuery = req.query.sqlQuery;
  sequelize
    .query(sqlQuery)
    .then((result) => {
      // Process the query result
      console.log(result);
      req.query.resultData = result;
      next();
    })
    .catch((error) => {
      // Handle any errors that occur
      console.error(error);
      res.status(500).send(error.message);
    });
};

exports.getResult = (req, res) => {
  const resultData = req.query.resultData;
  res.status(200).json(resultData);
};
