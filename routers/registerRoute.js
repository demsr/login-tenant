const express = require("express");

const router = express.Router();
const Login = require("../models/LoginSchema");

router.get("/", (req, res) => {
  let { invite } = req.query;

  res.render("pages/register", { invite: invite });
});

router.post("/", (req, res) => {
  console.log(req.body);
  let { email, password, password2, invite } = req.body;

  new Login({
    email: email,
    password: password,
  }).save((err, user) => {
    console.log(err);
    if (err)
      return res.render("pages/register", {
        error: { code: 500, message: "Could not create user" },
      });
    res.redirect("/login");
  });
});

module.exports = router;
