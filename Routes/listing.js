const express = require('express');
const router = express.Router();
const listingSchema = require('../schema.js');
const ExpressError = require('../utils/ExpressError.js');
const Listing = require('../models/listing.js');
const flash = require('connect-flash');
const { isloggedin } = require('../middleware.js');
const listingControllers = require("../Controllers/listings.js");
const multer  = require('multer');

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// to add backend server to cloudnary account using .env credential

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wonderlustDEV',
      allowedformat:["png" , "jpg" , "jpeg"] , // supports promises as well
      
    },
  });


// to upload the files data
const upload = multer({ storage });




// create new listing
// create route listing in database
router.get('/new', isloggedin , listingControllers.rendernewlisting);
router.post('/', upload.single('listingImage'), listingControllers.newListingcreate);



// show rout of particular listing
router.get('/:id', listingControllers.index);

// edit update rout update in database
router.get('/:id/update', isloggedin , listingControllers.updateListing);
router.put('/:id', upload.single('listingImage') , listingControllers.updatelistingDatabase);

// Delete Rout 
router.delete('/:id', isloggedin , listingControllers.deleteListing);

module.exports = router;

