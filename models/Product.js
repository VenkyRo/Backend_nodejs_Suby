const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  category: {
    type: [
      {
        type: String,
        enum: ["veg", "non-veg"]
      }
    ]
  },
  image: {
    type: String
  },
  bestSeller: {
    type: Boolean
  },
  descrption: {
    type: String
  },
  firm: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Firm"
    }
  ]
});

const Product = mongoose.model('Product',ProductSchema);

module.exports = Product;