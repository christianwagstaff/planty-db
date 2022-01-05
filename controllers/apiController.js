const Plant = require("../models/plant");
const Category = require("../models/category");

const async = require("async");
const { body, validationResult } = require("express-validator");

// Return all plants
exports.all_plants = (req, res, next) => {
  Plant.find({})
    .populate("category", { name: 1 })
    .exec((err, results) => {
      if (err) {
        return next(err);
      }
      // Success so return all results
      res.json(results);
    });
};

exports.all_categories = (req, res, next) => {
  Category.find({}).exec((err, results) => {
    if (err) {
      return next(err);
    }
    // Success so return all results
    res.json(results);
  });
};

// Get details for specific plant
exports.get_plant_id = (req, res, next) => {
  Plant.findById(req.params.id)
    .populate("category", "name")
    .exec((err, plant) => {
      if (err) {
        return next(err);
      }
      if (plant == null) {
        // No Results
        const err = new Error("No Results");
        err.status = 404;
        return next(err);
      }
      // Success Return Plant Details
      res.json(plant);
    });
};

// Create a new plant on POST
exports.create_plant = [
  // Convert the category to an array
  (req, res, next) => {
    console.log(req.body);
    if (!(req.body.category instanceof Array)) {
      if (typeof req.body.category === "undefined") {
        req.body.category = [];
      } else {
        req.body.category = new Array(req.body.category);
      }
    }
    next();
  },

  // Validate and sanitize fields
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name must be specified"),
  body("description")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Description must be specified"),
  body("price").trim().isNumeric().isLength({ min: 1 }),
  body("stock").trim().isNumeric().isLength({ min: 0 }),
  body("category.*").escape(),

  // Process request after validation and sanitization
  (req, res, next) => {
    const errors = validationResult(req);

    // Create a Plant obj with escaped and sanitized data
    const plant = new Plant({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
    });

    if (!errors.isEmpty()) {
      // There are errors
      // Send the data back for correction
      Category.find({}, "name").exec((err, categories) => {
        if (err) {
          return next(err);
        }
        // Mark selected categories as checked
        for (let cat of categories) {
          if (plant.category.indexOf(cat._id) > -1) {
            cat.checked = "true";
          }
        }
        res.json({
          name: req.body.name,
          plant,
          categories,
          errors: errors.array(),
        });
      });
      return;
    } else {
      // Data from form is valid. Save plant
      plant.save(function (err) {
        if (err) {
          return next(err);
        }
        // Success, send new plant details
        res.json({ msg: "Plant Created Successfully" });
      });
    }
  },
];

// Create new Category on POST
exports.create_category = [
  // Validate and sanitize fields
  body("name", "Category Name Required").trim().isLength({ min: 1 }).escape(),
  body("description", "Description is Required")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization
  (req, res, next) => {
    // Extract the validation errors from a request
    const errors = validationResult(req);

    // create a Category obj with escaped and trimmed data
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      // There are errors. Send the data back for correction
      res.status(400).json({ category, errors: errors.array() });
      return;
    } else {
      // Data from from is valid
      // Check if category with the same name already exists
      Category.findOne({ name: req.body.name }).exec((err, found_cat) => {
        if (err) {
          return next(err);
        }
        if (found_cat) {
          // Category exisits send back its data
          res.json({ category: found_cat });
        } else {
          category.save((err) => {
            if (err) {
              return next(err);
            }
            // Category saved, Send its data back
            res.status(201).json({
              category,
              msg: "Category Saved",
            });
          });
        }
      });
    }
  },
];

// Get Store Info on GET
exports.get_store_info = (req, res, next) => {
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
      res.json(results);
    }
  );
};
