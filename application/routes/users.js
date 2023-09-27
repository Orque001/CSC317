var express = require("express");
var router = express.Router();
var db = require("../conf/database");
var bcrypt = require("bcrypt");
var { isLoggedIn, isMyProfile } = require("../middleware/auth");

const {
  isUsernameUnique,
  usernameCheck,
  passwordCheck,
  emailCheck,
  tosCheck,
  ageCheck,
  isEmailUnique,
} = require("../middleware/validation");

router.post(
  "/registration",
  isUsernameUnique,
  usernameCheck,
  passwordCheck,
  emailCheck,
  tosCheck,
  ageCheck,
  isUsernameUnique,
  isEmailUnique,
  async function (req, res, next) {
    var { username, email, password } = req.body;

    try {
      // // check username unique
      // var [rows, fields] = await db.execute(
      //   `select id from users where username=?;`,
      //   [username]
      // );
      // if (rows && rows.length > 0) {
      //   return res.redirect("/registration");
      // }
      // // check email unique
      // var [rows, fields] = await db.execute(
      //   `select id from users where email=?;`,
      //   [email]
      // );
      // if (rows && rows.length > 0) {
      //   return res.redirect("/registration");
      // }
      var [rows, fields] = await db.execute(
        `select id from users where email=?;`,
        [email]
      );
      if (rows && rows.length > 0) {
        req.flash("error", `${email} is already taken`);
        return req.session.save(function (err) {
          return res.redirect("/registration");
        });
      }
      // hashing password
      var hashedPasword = await bcrypt.hash(password, 3);
      // insert
      var [resultObject, fields] = await db.execute(
        `INSERT INTO users
    (username, email, password)
    value
    (?,?,?);`,
        [username, email, hashedPasword]
      );
      // respond
      if (resultObject && resultObject.affectedRows == 1) {
        return res.redirect("/login");
      } else {
        return res.redirect("/registration");
      }
    } catch (error) {
      next(error);
    }
  }
);

router.post("/login", async function (req, res, next) {
  const { username, password } = req.body;
  if (!username || !password) {
    req.flash("error", `Log In Failed: Invalid username/password`);
    req.session.save(function (err) {
      return res.redirect("/login");
    });
  } else {
    var [rows, fields] = await db.execute(
      `select id,username,password,email from users where username=?;`,
      [username]
    );
    var user = rows[0];
    if (!user) {
      req.flash("error", `Log In Failed: Invalid username/password`);
      req.session.save(function (err) {
        return res.redirect("/login");
      });
    } else {
      var passwordsMatch = await bcrypt.compare(password, user.password);
      if (passwordsMatch) {
        req.session.user = {
          userId: user.id,
          email: user.email,
          username: user.username,
        };
        req.flash("success", `You are now logged in`);
        req.session.save(function (err) {
          return res.redirect("/");
        });
      } else {
        return res.redirect("/login");
      }
    }
  }
});

router.use(function (req, res, next) {
  if (req.session.user) {
    next();
  } else {
    return res.redirect("/login");
  }
});

// //router.get("/profile/:id(\\d+), isMyProfile"
router.get("/profile/:id(\\d+)", isLoggedIn, isMyProfile, function (req, res) {
  res.render("profile", { title: "Profile", css: ["style.css"] });
});

router.post("/logout", isLoggedIn, function (req, res, next) {
  req.session.destroy(function (err) {
    if (err) {
      next(error);
    }
    return res.redirect("/");
  });
});

module.exports = router;

/* GET localhost:3000/users
router.get('/', async function(req, res, next) {
  try{
    let [rows, fields] = await db.query(`select * from users;`);
    res.status(200).json({rows, fields})
  }catch(error){
    next(error);
  }
});

router.use(function (req, res, next) {
  if (req.session.user) {
    next();
  } else {
    return res.redirect("/login");
  }
});
*/
