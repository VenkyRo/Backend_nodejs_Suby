
const Vendor = require('../models/Vendor');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const dotEnv = require('dotenv');
dotEnv.config();

const secretkey = process.env.superKey;



const vendorRegister = async(req,res)=>{
    const {username,email,password} = req.body

    try {
        const vendorEmail = await Vendor.findOne({ email });
        if(vendorEmail){
            return res.status(400).json("Email Alreadey taken")
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const newVendor = new Vendor({
            username,
            email,
            password:hashedPassword
        });

        await newVendor.save();

        res.status(201).json({message:"Vendor registered Successfully"})
        console.log("registered");
        
    } catch (error) {
        console.error(error);
        res.status(500).json({error:"Internal Server Error vendor  regsiter"});
        
    }
}

const vendorLogin = async(req,res)=>{
    const {email,password} = req.body;

    try {
        const vendor = await Vendor.findOne({email});
        if(!vendor || !(await bcrypt.compare(password,vendor.password))){
            return res.status(401).json({error:"Invalid Username or password"});
        }

        const token =jwt.sign({vendorId:vendor._id}, secretkey, {expiresIn:"1h"})

        const vendorId = vendor._id;

        res.status(200).json({sucess:"Login Successfully!",token, vendorId});
        console.log("vendorEmail:",email ,"vendorToken:",token,"vendorID",vendorId);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error vendor login" });
        
    }
}


const getAllVendors = async(req,res)=>{
    try {
        const vendors = await Vendor.find().populate('firm');
        res.json({vendors})
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error vendor login" });
        
    }
}

const getVendorById = async(req,res)=>{
    const vendorId = req.params.id;

    try {
        const vendor = await Vendor.findById(vendorId).populate('firm');
        if(!vendor){
            return res.status(404).json({error:"vendor not found!"})
        }

        const vendorFirmId = vendor.firm[0]._id;

        res.status(200).json({vendorId,vendorFirmId,vendor})
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error vendor login" });
        
    }
}

module.exports = {
    vendorRegister,
    vendorLogin,
    getAllVendors,
    getVendorById,
}