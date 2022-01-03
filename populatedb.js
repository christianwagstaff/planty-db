#! /usr/bin/env node

console.log("This script populates some test plants and categories");

// Get arguments passed on command line
const userArgs = process.argv.slice(2);
const async = require("async");
const Plant = require("./models/plant");
const Category = require("./models/category");

const mongoose = require("mongoose");
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

let plants = [];
let categories = [];

function createPlant(name, description, category, price, stock, cb) {
  plantDetails = { name, description, price, stock };
  if (category != false) plantDetails.category = category;
  const plant = new Plant(plantDetails);
  plant.save(function (err) {
    if (err) {
      return cb(err, null);
    }
    console.log("Plant: " + plant);
    plants.push(plant);
    cb(null, plant);
  });
}

function createCategory(name, description, cb) {
  const categoryDetails = { name, description };
  const category = new Category(categoryDetails);
  category.save(function (err) {
    if (err) {
      return cb(err, null);
    }
    console.log("Category: " + category);
    categories.push(category);
    cb(null, category);
  });
}

function createCategories(cb) {
  async.series(
    [
      (callback) =>
        createCategory(
          "rare",
          "Highly sought after plants for those who value high end foliage",
          callback
        ),
      (callback) =>
        createCategory(
          "succulent",
          "Ornamental, low effort plants for the black-thumb among us",
          callback
        ),
      (callback) =>
        createCategory(
          "flowering",
          "Plants that produce a (usually) beautiful flower. You can't help but smell them!",
          callback
        ),
      (callback) =>
        createCategory(
          "indoor",
          "Plants that thrive in indirect/low lights. Perfect for your little aparatment!",
          callback
        ),
    ],
    // optional callback
    cb
  );
}

function createPlants(cb) {
  async.series(
    [
      (callback) =>
        createPlant(
          "Monstera",
          "This is a popular plant for the home or office throughout the temperate northern hemisphere.",
          [categories[0]],
          50,
          15,
          callback
        ),
      (callback) =>
        createPlant(
          "Orchid",
          "A flowering plant with blooms that are often colorful and fragrant.",
          [categories[2], categories[3]],
          20,
          100,
          callback
        ),
      (callback) =>
        createPlant(
          "Money Tree",
          "This plant is thought to provide good fortune for those who own it.",
          [categories[3]],
          10,
          20,
          callback
        ),
      (callback) =>
        createPlant(
          "String of Pearls",
          "This plant grown in long strings that look great hanging off the side of a pot.",
          [categories[1]],
          45,
          10,
          callback
        ),
      (callback) =>
        createPlant(
          "Bonsai",
          "This ornamental plant is individually cultivated and shaped though constant pruning and love.",
          [categories[0]],
          500,
          2,
          callback
        ),
    ],
    // Optional callback
    cb
  );
}

async.series(
  [createCategories, createPlants],
  // optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log("PLANTInstances: " + plants);
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
