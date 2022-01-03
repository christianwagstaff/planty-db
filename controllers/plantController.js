const Plant = require("../models/plant");
const Category = require("../models/category");

const async = require("async");
const { body, validationResult } = require("express-validator");

exports.index = (req, res, next) => {
  async.parallel(
    {
      plant_count: (callback) => Plant.countDocuments({}, callback),
      category_count: (callback) => Category.countDocuments({}, callback),
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      // Success so render
      res.render("index", {
        title: "Planty Admin Homepage",
        data: results,
      });
    }
  );
};

// Create a new plant GET
exports.plant_create_get = (req, res, next) => {
  res.return("Not Implemeneted Yet");
};
