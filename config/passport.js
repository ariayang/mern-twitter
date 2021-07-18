const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");

const User = require("../models/User");
//const User = mongoose.model("User");

require("dotenv").config();
const keys = process.env.secretOrKey;

const options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = keys;

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(options, (jwt_payload, done) => {
      // This payload includes the items we specified earlier
      //console.log(jwt_payload);
      User.findById(jwt_payload.id)
        .then((user) => {
          if (user) {
            // return the user to the frontend
            return done(null, user);
          }
          // return false since there is no user
          return done(null, false);
        })
        .catch((err) => console.log(err));
    })
  );
};