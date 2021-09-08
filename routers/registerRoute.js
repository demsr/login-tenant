const express = require("express");

const router = express.Router();
const Login = require("../models/LoginSchema");

router.get("/", (req, res) => {
  let { appid, redirect } = req.query;

  App.findById(appid, (err, app) => {
    if (err) return res.status(500).send("Server error");
    if (!app) return res.status(404).send("App not found");

    res.render("pages/register", {
      data: {
        redirect: redirect,
        appid: appid,
        appname: app.name,
        appdescription: app.description,
      },
    });
  });
});

router.post("/", (req, res) => {
  /**
   * - Check for existing user
   * - Check password for strength
   * - Send activation link to email
   */
  let { username, password, name, appid } = req.body;

  /**
   * Check email, password, password2
   */

  User.findOne({ username: username }, (err, user) => {
    if (err) return res.status(500).send();
    if (user)
      return res.render("pages/register", {
        data: { message: "Diese E-Mail ist schon in Benutzung", appid: appid },
      });

    new User({
      name: name,
      username: username,
      password: password,
    }).save((err, _) => {
      if (err)
        return res.render("pages/register", {
          data: {
            message: "Benutzer konnte nicht gespeichert werden",
            appid: appid,
          },
        });
      return res.redirect(`/login?appid=${appid}`);
    });
  });
}); // returns nothing

module.exports = router;
