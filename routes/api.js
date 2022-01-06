const express = require("express");
const router = express.Router();

const api_controller = require("../controllers/apiController");

/* GET all plant info. */
router.get("/plants/all", api_controller.all_plants);

// GET all categories
router.get("/plants/categories", api_controller.all_categories);

// POST create new category
router.post("/plants/categories/new", api_controller.create_category);

// Get Category by ID
router.get("/plants/categories/:id", api_controller.get_category_id);

// Edit Category by ID
router.put("/plants/categories/edit", api_controller.edit_category_id);

// POST Create new plant
router.post("/plants/new", api_controller.create_plant);

// GET plant by ID
router.get("/plants/:id", api_controller.get_plant_id);

// GET Store Info
router.get("/store/info", api_controller.get_store_info);

module.exports = router;
