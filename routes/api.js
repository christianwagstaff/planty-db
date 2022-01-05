const express = require("express");
const router = express.Router();

const api_controller = require("../controllers/apiController");

/* GET users listing. */
router.get("/plants/all", api_controller.all_plants);

// POST Create new plant
router.post("/plants/new", api_controller.create_plant);

// GET plant by ID
router.get("/plants/:id", api_controller.get_plant_id)

// GET Store Info
router.get("/store/info", api_controller.get_store_info)

module.exports = router;
