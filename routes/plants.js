var express = require("express");
var router = express.Router();

const plant_controller = require("../controllers/plantController");

/* GET plant homepage. */
router.get("/", plant_controller.index);

// GET requirest for create Plant
router.get("/plant/create", plant_controller.plant_create_get);

module.exports = router;
