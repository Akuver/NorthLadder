const express = require("express");
const searchController = require("../controllers/searchController");

const router = express.Router();

router
  .route("/")
  .get(
    searchController.getSQLQuery,
    searchController.executeSQLQuery,
    searchController.getResult
  );

module.exports = router;
