const express = require("express");
const firmController = require('../controllers/firmController');
const path = require('path')

const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

router.post('/add-firm',verifyToken,firmController.addFrim);

router.get('/uploads/:imageName',(req,res)=>{
    const imageName = req.params.imageName;
    res.headersSent('Content-Type','image/jpg');
    res.sendFile(path.join(__dirname,'..','uploads',imageName));
})

router.delete("/:firmId", firmController.deleteFirmById);

module.exports = router;