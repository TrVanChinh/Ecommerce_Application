require('./config/database')
require('dotenv').config()
// //mongodb

const express = require("express");
const app = express();
const port = process.env.PORT || 3000; 

const UserRouter = require('./api/User');

// Sử dụng middleware express.json() như là một hàm middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/user', UserRouter);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
