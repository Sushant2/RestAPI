const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, //here we're making a relation with product database though mongodb is non-relational DB
  quantity: { type: Number, default: 1 },
});

module.exports = mongoose.model("Order", orderSchema);
