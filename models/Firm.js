const mongoose = require('mongoose');
const Product = require('./Product');

const FrimSchema = new mongoose.Schema({
  firmName: {
    type: String,
    required: true,
    unique: true
  },
  area: {
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
  region: {
    type: [
      {
        type: String,
        enum: ["south-Indian", "north-Indian", "chinese", "bakery"]
      }
    ]
  },
  offer: {
    type: String
  },
  image: {
    type: String
  },
  vendor: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "vendor"
    }
  ],
  Products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    }
  ]
});

const Firm = mongoose.model('Firm',FrimSchema);

module.exports = Firm;