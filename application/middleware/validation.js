var validator = require("validator");
var db = require("../conf/database");

module.exports = {
  usernameCheck: function (req, res, next) {
    var { username } = req.body;
    username = username.trim();
    if (!validator.isLength(username, { min: 3 })) {
      req.flash("error", "username must be 3 or more characters");
    }
    if (!/[0-9a-zA-z]/.test(username.charAt(0))) {
      req.flash("error", "username must begin with a character");
    }
    if (req.session.flash.error) {
      res.redirect("/registration");
    } else {
      next();
    }
  },
  passwordCheck: function (req, res, next) {
    var { password } = req.body;
    password = password.trim();
    if (!validator.isLength(password, { min: 8 })) {
      req.flash("error", "password must be 8 or more characters");
    }
    if (
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password.charAt(0)
      )
    ) {
      req.flash("error", "password must begin with a character");
    }
    if (req.session.flash.error) {
      res.redirect("/registration");
    } else {
      next();
    }
    next();
  },
  emailCheck: function (req, res, next) {
    // var { email } = req.body;
    // email = email.trim();
    // if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.charAt(0))) {
    //   req.flash("error", "email must begin with a character");
    // }
    // if (req.session.flash.error) {
    //   res.redirect("/registration");
    // } else {
    //   next();
    // }
    next();
  },
  tosCheck: function (req, res, next) {
    next();
  },
  ageCheck: function (req, res, next) {
    next();
  },
  isUsernameUnique: async function (req, res, next) {
    var { username } = req.body;
    try {
      // check username unique
      var [rows, fields] = await db.execute(
        `select id from users where username=?;`,
        [username]
      );
      if (rows && rows.length > 0) {
        req.flash("error", `${username} is already taken`);
        return req.session.save(function (err) {
          return res.redirect("/registration");
        });
      } else {
        next();
      }
    } catch (error) {
      next(error);
    }
  },
  isEmailUnique: async function (req, res, next) {
    var { email } = req.body;

    try {
      // check email unique
      var [rows, fields] = await db.execute(
        `select id from users where email=?;`,
        [email]
      );
      if (rows && rows.length > 0) {
        req.flash("error", `${email} is already taken`);
        return req.session.save(function (err) {
          return res.redirect("/registration");
        });
      } else {
        next();
      }
    } catch (error) {
      next(error);
    }
  },
};
