// Require the Cloudinary library

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// to add backend server to cloudnary account using .env credential

cloudinary.config({
    cloud_name: "dac42sfah",
    api_key:486296546753888,
    api_secret: "1NSYKDd8f8bd_zUd6LRIM9qWkgA",
  });

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wonderlustDEV',
      allowedformat:["png" , "jpg" , "jpeg"] , // supports promises as well
      
    },
  });



module.exports = {cloudinary , cloudinary };