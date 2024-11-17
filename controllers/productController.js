const multer = require("multer");
const path = require("path");
const Product = require("../models/Product");
const Firm = require("../models/Firm");

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
    console.log("product added");
    


  } catch (error) {
     console.error(error);
     res.status(500).json({ error: "Internal Server Error product controller" });
    

  }
};

const getProductByFirm = async(req,res)=>{
    try {
        const firmId = req.params.firmId;

       

        const firm = await Firm.findById(firmId);

        if (!firm) {
          return res.status(401).json({ error: "product not Found!" });
        }

         const restaurentName = firm.firmName;

        const products = await Product.find({firm:firmId});

        res.status(201).json({ restaurentName, products });
        console.log("product added");


        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error product controller" });
    
        
    }
}

const deleteProductById = async(req,res)=>{
  try {
    const productId = req.params.productId;

    const deleteProduct = await Product.findByIdAndDelete(productId)

   if (!deleteProduct) {
    return res.status(404).json({ error: "product not Found!" });
   }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error product controller" });
    
    
  }
}


module.exports = { addProduct: [upload.single("image"), addProduct], getProductByFirm ,deleteProductById };
