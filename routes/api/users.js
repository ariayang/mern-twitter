const express = require("express");
const router = express.Router();

require("dotenv").config();
const keys = process.env.secretOrKey;

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User = require("../../models/User");

const passport = require("passport");

const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

/*************************** USER ROUTING **************************/

//router.get("/test", (req, res) => res.json({ msg: "This is the users route" }));

router.post("/register", (req, res) => {

    //Validator for registration information
      const { errors, isValid } = validateRegisterInput(req.body);

      if (!isValid) {
        return res.status(400).json(errors);
      }

  // Check to make sure nobody has already registered with a duplicate email
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      // Throw a 400 error if the email address already exists
      return res
        .status(400)
        .json({ email: "A user has already registered with this address" });
    } else {
      // Otherwise create a new user
      const newUser = new User({
        handle: req.body.handle,
        email: req.body.email,
        password: req.body.password,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => {
              // After successful register, Adding a token to the user
              const payload = { id: user.id, handle: user.handle };
              jwt.sign(
                payload,
                keys,
                { expiresIn: 3600 },
                (err, token) => {
                  res.json({
                    success: true,
                    token: "Bearer " + token,
                  });
                }
              );
            })

            .catch((err) => console.log(err));
        });
      });
    }
  });
});

router.post("/login", (req, res) => {

  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(404).json({ email: "This user does not exist" });
    }

    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        //res.json({ msg: "Success" });
        // Assigning a token: Payload
        const payload = { id: user.id, handle: user.handle };

        jwt.sign(
          payload,
          keys,
          // Tell the key to expire in one hour
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        return res.status(400).json({ password: "Incorrect password" });
      }
    });
  });
});


// You may want to start commenting in information about your routes so that you can find the appropriate ones quickly.
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
  res.json({
    //      msg: 'Success'

    //Return the JSON back to POSTMAN 'GET'
    id: req.user.id,
    handle: req.user.handle,
    email: req.user.email,
  });
})



module.exports = router;
