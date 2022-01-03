const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PlantSchema = new Schema({
  name: { type: String, required: true, maxlength: 100 },
  description: { type: String, required: true },
  category: [{ type: Schema.Types.ObjectId, ref: "Category" }],
  price: { type: Number, required: true, min: 1 },
  stock: { type: Number, required: true, min: 0 },
});

// Virtual Plant URL
PlantSchema.virtual("url").get(function () {
  return `/plants/plant/${this._id}`;
});

module.exports = mongoose.model("Plant", PlantSchema);
