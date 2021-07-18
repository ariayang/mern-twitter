const express = require("express");
const router = express.Router();
require("dotenv").config();

router.get("/test", (req, res) => res.json({ msg: "This is the movies route" }));

router.get("/top", (req, res) => {
    var axios = require("axios").default;

    var options = {
      method: "GET",
      url: "https://imdb8.p.rapidapi.com/title/get-most-popular-movies",
      params: {
        homeCountry: "US",
        purchaseCountry: "US",
        currentCountry: "US",
      },
      headers: {
        "x-rapidapi-key": process.env.keyAPI,
        "x-rapidapi-host": "imdb8.p.rapidapi.com",
      },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        res.send(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
});

router.get("/search", (req, res) => {
var axios = require("axios").default;

var options = {
  method: "GET",
  url: "https://imdb8.p.rapidapi.com/title/find",
  params: { q: "lord of the rings" },
  headers: {
    "x-rapidapi-key": "e527957255msh6645cd3ef7a0d17p12e70ejsn768441fd9a26",
    "x-rapidapi-host": "imdb8.p.rapidapi.com",
  },
};

axios
  .request(options)
  .then(function (response) {
    res.send(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });
});

module.exports = router;
