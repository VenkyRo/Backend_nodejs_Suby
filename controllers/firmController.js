 
//const Frim = require('../models/Firm');
const Vendor = require('../models/Vendor');

const multer = require("multer");
const path = require("path");
const Firm = require('../models/Firm');


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

const upload = multer({storage:storage});



const addFrim = async(req,res)=>{
 try {

     const { firmName, area, category, region, offer } = req.body;

     const image = req.file ? req.file.filename : undefined;

     const vendor = await Vendor.findById(req.vendorId);

     if (!vendor) {
       return res.status(401).json({ error: "vendor not Found!" });
     }

     const firm = new Firm({
       firmName,
       area,
       category,
       region,
       offer,
       image,
       vendor: vendor._id
     });

    const savedFirm = await firm.save();

    const firmId = savedFirm._id;

    vendor.firm.push(savedFirm);
    const vendorFirstName = savedFirm.firmName
    vendor.firm.push(savedFirm)

    await vendor.save();

    res.status(201).json({ message: "firm added  Successfully", firmId });
    console.log("frim added",firmId);

    
    
 } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error frim controller" });
    
 }
}

const deleteFirmById = async (req, res) => {
  try {
    const firmId = req.params.firmId;

    const deleteFirm = await Firm.findByIdAndDelete(firmId);

    if (!deleteFirm) {
      return res.status(404).json({ error: "firm not Found!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error firm controller" });
  }
};

module.exports = {addFrim:[upload.single('image'),addFrim],deleteFirmById}