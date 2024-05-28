const User = require('../models/User')
const cloudinary = require("../config/cloudinary");
const Product = require('../models/Product')

const path = require('path');
const fs = require('fs');


exports.uploadAvatar = async (req, res) => {
  let {userId} = req.body
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path);
      const uploadedImageUrl = uploadResult.url;
    
      fs.unlinkSync(req.file.path);

      User.findOne({ "_id": userId }) 
          .then(async data => {
            data.avatarUrl = uploadedImageUrl
            await data.save();
            res.json({
                status:"SUCCESS", 
                message: "Image uploaded successfully",
                data: uploadedImageUrl
            })
          }).catch(err => {
            res.json({
                status:"FAILED", 
                message: err
            })
        })   
    } else {
      res.status(400).json({ error: 'No image uploaded' });
    }
  };


// exports.uploadProductImage = async (req, res) => {
//   try {
//     // const { productId } = req.body;
//     const { file } = req;

//     if (!file) {
//       return res.status(400).json({ error: 'No image uploaded' });
//     }

//     const uploadResult = await cloudinary.uploader.upload(file.path, {
//       public_id: 'products/' + req.file.filename,
//     });
//     const uploadedImageUrl = uploadResult.url;

//     res.json({ message: 'Product image uploaded successfully', imageUrl: uploadedImageUrl });
//   } catch (error) {
//     console.error('Error uploading product image:', error);
//     res.status(500).json({ error: 'Failed to upload product image' });
//   }
// };

exports.uploadProductImages = async (req, res) => {
  try {
    const { files } = req; // Sử dụng req.files thay vì req.file để nhận mảng các file hình ảnh

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No images uploaded' });
    }

    const uploadedImageUrls = [];
    // Lặp qua từng file hình ảnh và tải lên lên Cloudinary
    for (const file of files) {
      const uploadResult = await cloudinary.uploader.upload(file.path, {
        public_id: 'products/' + file.filename,
      });

      uploadedImageUrls.push(uploadResult.url);
    }

    res.json({ message: 'Product images uploaded successfully', imageUrls: uploadedImageUrls });
  } catch (error) {
    console.error('Error uploading product images:', error);
    res.status(500).json({ error: 'Failed to upload product images' });
  }
};


//-------------------------------------------------------------\\


// exports.uploadProductImage = async (req, res) => {
//   // let {productId} = req.body
//   if (!req.files || req.files.length === 0) {
//     return res.status(400).json({ error: 'No images uploaded' });
//   }

//   if (req.files.length > 10) {
//       return res.status(400).json({ error: 'Maximum 10 images allowed' });
//   } else { 
//     const uploadedImages = [];
//     for (const image of req.files) {
//       const uploadResult = await cloudinary.uploader.upload(image.path,{
//                 public_id: 'products/' + image.filename,
//               });
//       uploadedImages.push(uploadResult.url); 
//       fs.unlinkSync(image.path);
//     }
//     // Product.findOne({ "_id": productId }) 
//     // .then(async product => {
      
//     //   if (!product) {
//     //     return res.status(404).json({ error: 'Product not found' });
//     //   }

//     //   const imageObjects = uploadedImages.map(url => ({ url }));
//     //   product.image = imageObjects;
//     //   await product.save();

//       res.json({ message: 'Image uploaded successfully' });
//     // }).catch(err => {
//       console.error(err); 
//       res.status(500).json({
//         status: "FAILED", 
//         message: err.message 
//       // });
//     })   
//   }
// };

  
// app.post('/upload', upload.array('images'), async (req, res) => {
//   const uploadedImages = [];

//   for (const image of req.files) {
//     const uploadResult = await cloudinary.uploader.upload(image.path);
//     uploadedImages.push(uploadResult.url); 
//   }

//   const savedImages = await Image.insertMany(uploadedImages.map(url => ({ url })));

//   res.json({ message: 'Images uploaded successfully', images: savedImages });
// });