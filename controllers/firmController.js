 

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



const addFirm = async (req, res) => {
  try {
    const { firmName, area, category, region, offer } = req.body;

    const image = req.file ? req.file.filename : undefined;

    const vendor = await Vendor.findById(req.vendorId);
    if (!vendor) {
      res.status(404).json({ message: "Vendor not found" });
    }

    if (vendor.firm.length > 0) {
      return res.status(400).json({ message: "vendor can have only one firm" });
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
    const vendorFirmName = savedFirm.firmName;

    vendor.firm.push(savedFirm);

    await vendor.save();

    return res
      .status(200)
      .json({ message: "Firm Added successfully ", firmId, vendorFirmName });
  } catch (error) {
    console.error(error);
    res.status(500).json("intenal server error");
  }
};

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

module.exports = { addFrim: [upload.single("image"), addFirm], deleteFirmById };