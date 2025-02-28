const Listing = require('../models/listing');

module.exports.index = async (req, res) => {
    let { id } = req.params;

    try {
        let listing = await Listing.findById(id).populate('reviews').populate('owner');
        res.render('listings/show.ejs', { listing });


    } catch (error) {
        console.log('listing not Found ');
        console.log(error);
    }
}

// new listing creation and rendering

module.exports.rendernewlisting = (req, res) => {
    // res.render('new.ejs');

    // checking user loged in or not if login then it will we render by middleware
    res.render('listings/new.ejs');
}

module.exports.newListingcreate = async (req, res) => {

    // let result = listingSchema.validate(req.body);


    try {
        let url = req.file.path;
        let filename = req.file.filename;

        let { title, description, image, price, location, country } = req.body;

        let listing = new Listing({
            title: title,
            description: description,
            image: image,
            price: price,
            location: location,
            country: country,
        });

        listing.owner = req.user._id;
        listing.image = { url, filename }
        let result = await listing.save();



        req.flash('success', 'new Listing Created');


        res.redirect('/listing');

    } catch (err) {
        next(err)
    }


}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findByIdAndUpdate(id);
    if(!listing){
        req.flash("error" , "this listing is currently unavailable");
        res.redirect('/listing');
    }

    let OriginalImage = listing.image.url;
    // OriginalImage =  OriginalImage.replace("/upload" , "/upload/w_250");

    res.render('listings/update.ejs', { listing , OriginalImage });
}

module.exports.updatelistingDatabase = async (req, res) => {
  
    let { id } = req.params;
    let { title, description, image , price, location, country } = req.body;

    let listing = await Listing.findByIdAndUpdate(id, {
        title: title,
        description: description,
        image:image,
        price: price,
        location: location,
        country: country,
    });

    if (typeof req.file != "undefined") {
        // checking if new file exist or not if exist then 
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        listing.save();
        
    }

    req.flash('success', ' Listing updated Successfully');
    res.redirect(`/listing/${id}`);
  
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;

    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing); 
    res.redirect('/listing');

}