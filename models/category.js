const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const opts = {toJSON: {virtuals:true}}

const CategorySchema = new Schema({
  name: { type: String, maxlength: 100, required: true },
  description: { type: String, required: true },
}, opts);

// Virtual for Category URL
CategorySchema.virtual("url").get(function () {
  return `/plant/category/${this._id}`;
});

CategorySchema.virtual("name_formatted").get(function () {
  return `${this.name
    .substring(0, 1)
    .toUpperCase()}${this.name.substring(1).toLowerCase()}`;
});

module.exports = mongoose.model("Category", CategorySchema);
