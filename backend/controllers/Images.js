const User = require('../models/User')
const cloudinary = require("../config/cloudinary");

exports.uploadAvatar = async (req, res) => {
  let {userId} = req.body
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path);
      const uploadedImageUrl = uploadResult.url;
    
      User.findOne({ "_id": userId })
          .then(async data => {
            data.avatarUrl = uploadedImageUrl
            await data.save();
          }).catch(err => {
            res.json({
                status:"FAILED",
                message: err
            })
        })   
      res.json({ message: 'Image uploaded successfully' });
    } else {
      res.status(400).json({ error: 'No image uploaded' });
    }
  };

  
// app.post('/upload', upload.array('images'), async (req, res) => {
//   const uploadedImages = [];

//   for (const image of req.files) {
//     const uploadResult = await cloudinary.uploader.upload(image.path);
//     uploadedImages.push(uploadResult.url); 
//   }

//   const savedImages = await Image.insertMany(uploadedImages.map(url => ({ url })));

//   res.json({ message: 'Images uploaded successfully', images: savedImages });
// });