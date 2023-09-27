var express = require("express");
const { isLoggedIn } = require("../middleware/auth");
var router = express.Router();

/* GET home page. */
// localhost::3000 is the domain
router.get("/", function (req, res, next) {
  res.render("index", { title: "CSC 317 App", name: "Riel Orque", css:["style.css"], js:["viewpost.js"] });
});

router.get("/main", function (req, res) {
  res.render("main", { title: "CSC 317 App", css:["style.css"], js:["fetchindex.js"] });
});

router.get("/login", function (req, res) {
  res.render("login", { title: "Login", css:["style.css"]});
});

router.get("/registration", function (req, res) {
  res.render("registration", { title: "Registration", css:["style.css"], js:["registration.js"]});
});

router.get("/postvideo", isLoggedIn, function (req, res) {
  res.render("postvideo", { title: "Upload Video", css:["style.css"] });
});

// /router.get("/profile/:id(\\d+)", isMyProfile, function (req, res) {
// router.get("/profile/:id(\\d+)", function (req, res) {
//   res.render("profile", { title: "Profile", css: ["style.css"] });
// });

module.exports = router;
