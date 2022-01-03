const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, maxlength: 100, required: true },
  description: { type: String, required: true },
});

// Virtual for Category URL
CategorySchema.virtual("url").get(function () {
  return `/plant/category/${this._id}`;
});

module.exports = mongoose.model("Category", CategorySchema);
