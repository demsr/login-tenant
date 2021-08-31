require("dotenv").config();
const express = require("express");
const app = express();
const chalk = require("chalk");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");

const mdb = require("./db/MongoDB");

const LoginRouter = require("./routers/loginRoute");
const RegisterRouter = require("./routers/registerRoute");
const LogoutRouter = require("./routers/logoutRoute");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:4000"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.use("/login", LoginRouter);
app.use("/register", RegisterRouter);
app.use("/logout", LogoutRouter);

app.get("*", (req, res) => {
  res.render("pages/notFound");
});

mdb.once("open", () => {
  console.log(chalk.green("MongoDB connected"));
  app.listen(process.env.PORT, () => {
    console.log(`server running on port ${process.env.PORT}`);
  });
});
