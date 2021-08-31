const express = require("express");

const router = express.Router();
const Auth = require("../models/LoginSchema");
const App = require("../models/RefAppSchema");
const { nanoid } = require("nanoid");
const redis = require("../db/Redis");

router.get("/", (req, res) => {
  let { appid } = req.query;

  res.render("pages/login", { appid: appid });
});

router.post("/", (req, res) => {
  let { email, password, appid } = req.body;

  Auth.findOne({ email: email }, (err, user) => {
    if (err)
      return res.render("pages/error", {
        error: { code: 500, message: "Got error while looking for user" },
      });
    if (!user) return res.render("pages/login");

    user.comparePassword(password, (err, isMatch) => {
      if (err) return res.render("pages/login");
      if (isMatch) {
        let accesstoken = nanoid(64);
        redis.set(accesstoken, user._id);
        console.log(appid);

        let search = appid ? { _id: appid } : { default: true };
        console.log(search);
        App.findOne(search, (err, app) => {
          console.log(app);
          if (err)
            return res.render("pages/error", {
              error: {
                code: 500,
                message: "Error while looking for your app",
              },
            });
          if (!app)
            return res.render("pages/error", {
              error: { code: 500, message: "We did not find that app" },
            });

          res.redirect(`${app.url[0]}?token=${accesstoken}`);
        });
      } else {
        return res.render("pages/login");
      }
    });
  });
});

module.exports = router;
