//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const FacebookStrategy = require('passport-facebook').Strategy;
const queryString = require('query-string');



const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));
// save user sessionusing cookies
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));

//initializa passport and use it to manage sessions
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost:27017/userDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String,
    facebookId: String,
    secret: String
});
// Add plugins to userSchema
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const user = mongoose.model("User", userSchema);

// use static authenticate method of model in LocalStrategy
passport.use(user.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    user.findById(id, function(err, user) {
        done(err, user);
    });
});
// authenticate method of google strategy
passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/secrets",
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"

    },
    function(accessToken, refreshToken, profile, cb) {
        console.log(profile);
        user.findOrCreate({
            googleId: profile.id
        }, function(err, user) {
            return cb(err, user);
        });
    }
));
// authenticate method of facebook strategy
passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "http://localhost:3000/auth/facebook/secrets"

    },
    function(accessToken, refreshToken, profile, done) {
        user.findOrCreate({
            facebookId: profile.id
        }, function(err, user) {
            if (err) {
                return done(err);
            }
            done(null, user);
        });
    }
));



app.get("/", function(req, res) {
    res.render("home");
});

//GOOGLE AUTHOURAZITION ROUTES
app.get("/auth/google",
    passport.authenticate('google', {
        scope: ["profile"]
    }));

app.get("/auth/google/secrets",
    passport.authenticate('google', {
        failureRedirect: '/login'
    }),
    function(req, res) {
        // Successful authentication, redirect secrets.
        res.redirect('/secrets');
    });

app.get("/login", function(req, res) {
    res.render("login");
});
app.get("/register", function(req, res) {
    res.render("register");
});

//FACEBOOK AUTHOURAZITION ROUTES
app.get('/auth/facebook',
    passport.authenticate('facebook', { scope: 'email' })
);

app.get('/auth/facebook/secrets',
    passport.authenticate('facebook', {
        failureRedirect: '/login'
    }),
    function(req, res) {
        // Successful authentication, redirect Secrets.
        res.redirect('/secrets');
    });


//Secrets route displays secrets to anyone
app.get("/secrets", function(req, res) {
    user.find({ "secret": { $ne: null } }, function(err, foundUsers) {
        if (err) {
            console.log(err);
        } else {
            if (foundUsers) {
                res.render("secrets", { usersWithSecrets: foundUsers });
            }
        }
    });
});


app.get("/submit", function(req, res) {
    if (req.isAuthenticated) {
        res.render("submit");
    } else {
        res.redirect("/login");
    }
});
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});




app.post("/submit", function(req, res) {
    const submittedSecret = req.body.secret;
    const userId = req.user._id;

    //Once the user is authenticated and their session gets saved, their user details are saved to req.user.
    user.findById(userId, function(err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                foundUser.secret = submittedSecret;
                foundUser.save(function() {
                    res.redirect("/secrets");
                });
            }
        }
    });
});


app.post("/register", function(req, res) {
    user.register({
        username: req.body.username
    }, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/secrets");
            });
        }
    });

});


app.post("/login", function(req, res) {

    const User = new user({
        name: req.body.username,
        password: req.body.passwword
    });
    req.login(User, function(err) {
        if (err) {
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/secrets");
            });
        }
    });

});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});