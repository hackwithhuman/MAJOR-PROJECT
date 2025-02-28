require("dotenv").config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const Review = require('./models/review.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require('./utils/ExpressError.js');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const Reviews = require('./models/review.js');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const user = require('./models/userauth.js');
const listingrout = require('./Routes/listing.js');
const userrout = require('./Routes/userrout.js');
const userauth = require('./models/userauth.js');
const bodyParser = require('body-parser');





const port = 8080;


// const MONGO_URL = 'mongodb://127.0.0.1:27017/wonderlust';
const dbURL = process.env.ATLASDB_URL;

main().then((res) => { console.log('connection successful') })
    .catch(err => console.log(err.message));

async function main() {
    await mongoose.connect(dbURL , {
        // useNewUrlParser:true,
        // useUnifiedTopology:true,
    });
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));// for decode the url data 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method')); // for put request method in form
app.engine('ejs', ejsMate); // for ejs-mate
app.use(express.static(path.join(__dirname, "/public"))); // for all static files to aply on webpage like css and java-script
app.use(express.json());


const store = MongoStore.create({
    mongoUrl:dbURL,
    crypto:{
        secret: process.env.SECERET_KEY
    },
    touchAfter: 24*3600,
});

const sessionOption = {
    store:store,
    secret: process.env.SECERET_KEY,
    resave: false,
    saveUninitialize: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
        maxAge: 1000 * 60 * 60 * 24 * 3,
        httpOnly: true,
    }
}

app.use(session(sessionOption));
app.use(flash());

//  this is all use for authentication for the user on website , associated with session cookies 

app.use(passport.initialize()); // IT IS REQUIRED
app.use(passport.session()); // it is also required

passport.use(new LocalStrategy(userauth.authenticate()));

passport.serializeUser(userauth.serializeUser());
passport.deserializeUser(userauth.deserializeUser());

// authentication is end 


// middleware for flash messages  
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currUser = req.user;

    next();
});


app.get('/', async (req, res) => {
    let allListing = await Listing.find({});
    res.render('listings/index.ejs', { allListing });

});

app.get('/listing', async (req, res) => {
    let allListing = await Listing.find({});
    res.render('listings/index.ejs', { allListing });

});







app.use('/listing', listingrout);
app.use('/' , userrout);

// searching API 

app.get('/search', async (req, res) => {
    const query = req.query.q || '';
    try {
      const searchlisting = await Listing.find({
        $or: [
          { country: new RegExp(query, 'i') },
          { location: new RegExp(query, 'i') }
        ]
      });
      
      res.render('listings/searched.ejs', { searchlisting  });
    // res.send(searchlisting);
    } catch (error) {
      res.status(500).send('Error searching items');
    }
    // res.send(query);
  });

// Review Route  POST Request

app.post('/listing/:id/reviews', async (req, res) => {
    let id = req.params;
    let listing = await Listing.findById(req.params.id);
    let newReview = new Reviews(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    req.flash('success' ,"Review added Thanks!");
    await listing.save();
    res.redirect(`/listing/${listing._id}`);
    console.log(id);

})

// delete review

app.delete('/listing/:id/reviews/:reviewId' ,  async (req , res)=>{

   let {id , reviewId } = req.params;
   await Listing.findByIdAndUpdate(id, {$pull: {reviews : reviewId}});
   await Review.findByIdAndDelete(reviewId);
   res.redirect(`/listing/${id}`);
   req.flash("success" , "Review deleted")
})



// // page not found

app.all('*', (err, req, res, next) => {
    req.flash("error",err.message);
    next(new ExpressError(404, "Page Not Found"));
    next();
});


// custom Error handle 
app.use((err, req, res, next) => {
    let { statuscode, message } = err;
    // res.status(statuscode).send(message);
    res.render("Error.ejs");
    next();

});


app.listen(port, () => {
    console.log(`app is listning on port ${port}`);
    
});
