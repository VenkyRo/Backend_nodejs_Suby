const multer = require("multer");
const path = require("path");
const Product = require("../models/Product");
const Firm = require("../models/Firm");

const mongoose = require("mongoose");


// Set storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // Uploads folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Unique file name
  }
});

const upload = multer({ storage: storage });

const addProduct = async (req, res) => {
  try {
    const { productName, price, category, bestSeller, descrption } = req.body;

    const image = req.file ? req.file.filename : undefined;

    const firmId = req.params.firmId;
    const firm = await Firm.findById(firmId);

    if (!firm) {
      return res.status(401).json({ error: "firm not Found!" });
    }

    const product = new Product({
      productName,
      price,
      category,
      image,
      bestSeller,
      descrption,
      firm: firm._id
    });

    const saveProduct = await product.save();

   firm.Products.push(saveProduct);

    await firm.save();

    res.status(201).json({saveProduct});
    console.log("product added sucssfully");
    


  } catch (error) {
     console.error(error);
     res.status(500).json({ error: "Internal Server Error product controller" });
    

  }
};

// const getProductByFirm = async(req,res)=>{
//     try {
//         const firmId = req.params.firmId;

//         const firm = await Firm.findById(firmId);

//         if (!firm) {
//           return res.status(401).json({ error: "product not Found!" });
//         }

//          const restaurentName = firm.firmName;

//         const products = await Product.find({firm:firmId});

//         res.status(201).json({ restaurentName, products });
//         console.log("sucessfylly get  porducts");


        
//     } catch (error) {
//         console.error(error);
//         res
//           .status(500)
//           .json({error: "Internal Server Error product controller getProductByFirm"});
    
        
//     }
// }





const getProductByFirm = async (req, res) => {
  try {
    const firmId = req.params.firmId;

    // Validate firmId format
    if (!firmId || !mongoose.Types.ObjectId.isValid(firmId)) {
      return res.status(400).json({ error: "Invalid or missing firmId" });
    }

    // Fetch firm details
    const firm = await Firm.findById(firmId);
    if (!firm) {
      return res.status(404).json({ error: "Firm not found" });
    }

    // Extract firmName
    const restaurentName = firm.firmName;

    // Fetch products linked to the firm
    const products = await Product.find({ firm: firmId });
    if (!products || products.length === 0) {
      return res.status(404).json({ error: "No products found for this firm" });
    }

    // Send response with firm name and products
    res.status(200).json({ restaurentName, products });
    console.log("Successfully retrieved products");
  } catch (error) {
    console.error("Error in getProductByFirm:", error);
    res.status(500).json({
      error: "Internal Server Error in getProductByFirm",
      details: error.message
    });
  }
};















const deleteProductById = async (req, res) => {
  try {
    const productId = req.params.productId;

    // Check if the product exists
    const deleteProduct = await Product.findByIdAndDelete(productId);

    if (!deleteProduct) {
      return res.status(404).json({ error: "Product not found!" });
    }

    console.log(`Product with ID ${productId} deleted successfully`);

    // Respond with a success message
    res.status(200).json({
      message: "Product deleted successfully",
      product: deleteProduct
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error - Product controller" });
  }
};




module.exports = { addProduct: [upload.single("image"), addProduct], getProductByFirm ,deleteProductById };
