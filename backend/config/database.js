
require('dotenv').config()
const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGODB_URI + 'EcommerceDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log(err));
