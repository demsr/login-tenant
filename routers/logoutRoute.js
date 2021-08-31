const express = require("express");

const router = express.Router();
const Auth = require("../models/LoginSchema");
const App = require("../models/RefAppSchema");

const redis = require("../db/Redis");

router.get("/logout", (req, res) => {
  let { refreshtoken } = req.cookies;

  //if (!refreshtoken) return res.status(400).send("no refresh cookie found");

  redis.del(refreshtoken);

  res.cookie("refreshtoken", "", { expires: 0, httpOnly: true });

  res.render("pages/logout");
});

module.exports = router;
