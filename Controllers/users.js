const User = require('../models/userauth');

module.exports.randerSignup = (req, res) => {
    res.render('useer/signup.ejs');
}

module.exports.signup = async (req, res) => {

    try {
        let { username, email, password } = req.body;
        const newuser = new User({ email, username });
        const registerduser = await User.register(newuser, password);

        req.login(registerduser, (err) => {
            if (err) {
                return next(err);
            }

            req.flash('success', 'registerd successfully');
            res.redirect('/listing');
        });

    } catch (e) {

        console.log(e.message)
        req.flash("error" , e.message);
        res.redirect('/signup');
        // res.render('useer/signup-roor.ejs');

    }

}

module.exports.randerLogin = (req, res) => {
    res.render('useer/login.ejs');
}

module.exports.login = async (req, res) => {
    const loginUsername = req.body.username;
    req.flash('success', `Welcome back ${loginUsername}` );
    res.redirect('/listing');
    req.flash("error" , "username or Password Is incorrect");

}

module.exports.logOut =  (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'You are logged out!');
        res.redirect('/listing');
    })
}
