const Review = require("./models/review");


module.exports.isloggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // alert("Please Login ");
        req.flash("error", "please login first to Wonderlust")
        return res.redirect('/login');
    }

    next();
}


