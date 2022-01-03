const express = require("express");
const router = express.Router();

const api_controller = require("../controllers/apiController");

/* GET users listing. */
router.get("/plants", api_controller.all_plants);

module.exports = router;
