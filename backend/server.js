require('./config/database')
require('dotenv').config()
// //mongodb

const express = require("express");
const app = express();
const port = process.env.PORT || 3000; 
const cors = require("cors");


const router = require('./router/Router');

// Sử dụng middleware express.json() như là một hàm middleware
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// app.use('/user', UserRouter);
app.use(router);
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
