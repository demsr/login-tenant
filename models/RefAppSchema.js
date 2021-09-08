const mongoose = require("mongoose");
const Redis = require("ioredis");
const redis = new Redis();

const Schema = new mongoose.Schema({
  name: String,
  isDefault: { type: Boolean, default: false },
  url: String,
  redirects: [String],
});

const Model = mongoose.model("RefApp", Schema, "RefApp");

redis.subscribe("app", (err, count) => {
  if (err) {
    // Just like other commands, subscribe() can fail for some reasons,
    // ex network issues.
    console.error("Failed to subscribe: %s", err.message);
  } else {
    // `count` represents the number of channels this client are currently subscribed to.
    console.log(`Listening for changes in Apps`);
  }
});

redis.on("message", (channel, message) => {
  console.log(message);
  message = JSON.parse(message);

  Model.findById(message._id, (err, app) => {
    if (err) return console.log(err);
    if (!app) {
      new Model(message).save((err) => {
        if (err) console.log(err);
      });
    } else {
      app.name = message.name;
      app.isDefault = message.isDefault;
      app.url = message.url;
      app.redirects = [...message.redirects];
      app.save((err) => {
        if (err) console.log(err);
      });
    }
  });
});

module.exports = Model;
