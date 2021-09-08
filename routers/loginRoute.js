const express = require("express");

const router = express.Router();
const Auth = require("../models/LoginSchema");
const App = require("../models/RefAppSchema");
const { nanoid } = require("nanoid");
const redis = require("../db/Redis");

router.get("/", (req, res) => {
  let { appid, redirect } = req.query;

  let search = appid ? { _id: appid } : { isDefault: true };

  App.findOne(search, (err, app) => {
    if (err)
      return res.render("pages/error", {
        error: { code: 500, message: "Error finding app" },
      });
    if (!app)
      return res.render("pages/error", {
        error: { code: 500, message: "App not found" },
      });

    res.render("pages/login", {
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
  const { username, password, appid, redirect } = req.body;

  Auth.findOne({ username: username }, (err, user) => {
    if (err) return res.status(500).send({ message: err });
    if (!user)
      return res.render("pages/login", {
        data: {
          message: "Unbekannter Benutzer",
          redirect: redirect,
          appid: appid,
        },
      });

    let search = appid ? { _id: appid } : { isDefault: true };

    App.findOne(search, (err, app) => {
      if (err)
        return res.render("pages/error", {
          error: { code: 500, message: "An Error occured" },
        });

      if (!app)
        return res.render("pages/error", {
          error: { code: 500, message: "App not found" },
        });

      if (!app.redirects.includes(redirect)) {
        redirect = app.url;
      }

      user.comparePassword(password, async (err, isMatch) => {
        if (err) return res.status(500).send({ message: "server error" });
        if (isMatch) {
          let accesstoken = nanoid(64);
          redis.set(accesstoken, user._id);
          res.redirect(`${redirect}?token=${accesstoken}`);
        } else {
          return res.render("pages/login", {
            data: {
              message: "falsches Passwort",
              appid: appid,
              appname: app.name,
              appdescription: app.description,
            },
          });
        }
      });
    });
  });
}); // returns accesstoken

module.exports = router;
