const Plant = require("../models/plant");
const Category = require("../models/category");

const async = require("async");
const { body, validationResult } = require("express-validator");

exports.all_plants = (req, res, next) => {
  Plant.find({})
    .populate("category", {name: 1, _id: 0})
    .exec((err, results) => {
        if (err) {
            return next(err)
        }
        // Success so return all results
        res.json(results)
    });
};
