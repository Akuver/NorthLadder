const { sequelize } = require("../models/db");
const axios = require("axios");

async function getSchema() {
  // Get an array of all the tables in the database
  const tableNames = await sequelize.showAllSchemas();

  // Loop over each table and get its schema
  const schema = {};
  for (const tableName of tableNames) {
    const Model = sequelize.model(tableName);
    const tableSchema = await Model.describe();
    schema[tableName] = tableSchema;
  }
  return schema;
}

exports.getSQLQuery = async (req, res, next) => {
  const inputText = req.query.inputText;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  };
  const databaseSchema = await getSchema();
  const data = JSON.stringify({
    model: "text-davinci-002",
    prompt: `Provide a SQL query to retrieve the data from the following schema: \n${JSON.stringify(
      databaseSchema
    )}\nGiven the following input: ${inputText}`,
    temperature: 0.5,
    max_tokens: 100,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  const options = {
    method: "POST",
    headers,
    data,
  };
  axios
    .post(
      "https://api.openai.com/v1/engines/davinci-codex/completions",
      options
    )
    .then((response) => {
      req.query.sqlQuery = response.data.choices[0].text.trim();
      next();
    })
    .catch((error) => {
      console.log(error);
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
