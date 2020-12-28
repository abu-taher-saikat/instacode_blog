const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const keys = require("./keys");
const User = require("../model/user-model");

passport.serializeUser((user, done) => {
  // mongod db user id here
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // mongod db user id here
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      // options for the google strategy
      callbackURL: "/auth/google/redirect",
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret,
    },
    (accessToken, refreshToken, profile, done) => {
      //   check if user already exists in our dbs
      User.findOne({ googleid: profile.id }).then((currentUser) => {
        if (currentUser) {
          // already have the user.
          console.log("user is :", currentUser);
          done(null, currentUser);
        } else {
          // if no, create user in db.then create one.
          // console.log(profile);
          new User({
            username: profile.displayName,
            googleid: profile.id,
            thumbnail: profile.photos[0].value,
          })
            .save()
            .then((newUser) => {
              console.log("new user Created :" + newUser);
              done(null, newUser);
            });
        }
      });
    }
  )
);