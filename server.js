const express = require("express");
const app = express();
const User = require("./models/user");
const Item = require("./models/item");
const mongoose = require("mongoose");

const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

mongoose.connect("mongodb://localhost:27017/Auth");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

const GOOGLE_CLIENT_ID =
  "871367120245-t51od94o1vsh1d0kvkkqrjujl2r6opum.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
clientID = "627944135167162";
clientSecret = "1c266c5f2676764f40a2f9af92e03e06";

app.set("view engine", "ejs");

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET",
  })
);

app.get("/", function (req, res) {
  res.render("auth");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("App listening on port " + port));

var userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

app.get("/error", (req, res) => res.send("error logging in"));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      userProfile = profile;
      return done(null, userProfile);
    }
  )
);

app.get("/", function (req, res) {
  res.render("auth");
});

app.get("/success", isLoggedIn, async (req, res) => {
  try {
    const found = await User.findOne({ email: req.user._json.email });
    if (found) {
      console.log("Alredy data is Save");
      res.render("success.ejs", {
        user: req.user,
      });
    }
    await User.create({
      email: req.user._json.email,
      googleid: req.user._json.sub,
    });
    res.render("success.ejs", {
      user: req.user,
    });
  } catch {
    console.log("Do not get the Data");
  }
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/success",
    failureRedirect: "/error",
  })
);

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
}

// FaceBook Auth

passport.use(
  new FacebookStrategy(
    {
      clientID: clientID,
      clientSecret: clientSecret,
      callbackURL: "http://localhost:3000/auth/facebook/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);

app.get("/", function (req, res) {
  res.render("auth");
});

app.get("/profile", isLoggedIn, async (req, res) => {
  try {
    const find = await Item.findOne({ facebookid: req.user.id });
    // console.log(found)
    if (find) {
      console.log("Alredy data is Save");
      res.render("profile.ejs", {
        user: req.user,
      });
    }
    await User.Item({ facebookid: req.user.id });
    res.render("profile.ejs", {
      user: req.user,
    });
  } catch {
    console.log("Do not get the Data");
  }
});

app.get("/error", isLoggedIn, function (req, res) {
  res.render("pages/error.ejs");
});

app.get(
  "/auth/facebook",
  passport.authenticate("facebook", {
    scope: ["public_profile", "email"],
  })
);

app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/profile",
    failureRedirect: "/error",
  })
);

app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/");
}
