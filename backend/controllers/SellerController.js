require("dotenv").config()
//mongodb user model
const User = require('../models/User')
const Admin = require('../models/Admin')
//Password handler
const bcrypt = require('bcrypt')

//email handler
const nodemailer = require('nodemailer')