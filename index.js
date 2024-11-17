const express = require('express');
const dotEnv = require('dotenv');
dotEnv.config();
const mongoose  = require('mongoose');
const bodyParser = require('body-parser');
const vendorRoutes = require('./routes/vendorRoutes');
const firmRoutes = require('./routes/firmRoute');
const productRoutes = require('./routes/productRoutes');
const cors = require('cors');
const path = require('path');

const app = express();

const PORT = 4000;


mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected Sucessfully!"))
.catch((err) => console.error("MongoDB Connection Error:", err));



app.use(bodyParser.json());

app.use('/vendor',vendorRoutes);
app.use('/firm', firmRoutes)
app.use('/product', productRoutes);
// Middleware to serve static files
app.use('/uploads', express.static('uploads'));





app.use('/home',(req,res)=>{
    res.send('<h1>Welcome To Sugi</h1>')
})

app.listen(PORT,()=>{
    console.log(`server started and running port ${PORT}`)
})