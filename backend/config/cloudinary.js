const cloudinary = require('cloudinary').v2

cloudinary.config({ 
    cloud_name: 'dvr86bxv3', 
    api_key: '337225314845726', 
    api_secret: 'H6TveqILa5NthxNkIkJ8kgxg0lQ' 
  });

module.exports = cloudinary