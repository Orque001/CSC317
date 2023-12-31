var express = require("express");
var router = express.Router();
var multer = require("multer");
var db = require("../conf/database");
const { isLoggedIn } = require("../middleware/auth");
const {
  makeThumbnail,
  getPostById,
  getCommentsForPostById,
} = require("../middleware/posts");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/videos/uploads");
  },
  filename: function (req, file, cb) {
    var fileExt = file.mimetype.split("/")[1];
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExt}`);
  },
});

const upload = multer({ storage: storage });

router.post(
  "/create",
  isLoggedIn,
  upload.single("uploadVideo"),
  makeThumbnail,
  async function (req, res, next) {
    var { title, description } = req.body;
    var { path, thumbnail } = req.file;
    var { userId } = req.session.user;

    try {
      var [insertResult, _] = await db.execute(
        `INSERT INTO posts (title,description, video, thumbnail, fk_userId) VALUE (?,?,?,?,?);`,
        [title, description, path, thumbnail, userId]
      );
      if (insertResult && insertResult.affectedRows) {
        req.flash("success", "Your post was created!");
        return req.session.save(function (error) {
          if (error) next(error);
          return res.redirect(`/posts/${insertResult.insertId}`);
        });
      } else {
        next(new Error("Post could not be created"));
      }
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:id(\\d+)",
  getPostById,
  getCommentsForPostById,
  function (req, res) {
    res.render("viewpost", {
      title: `View Post ${req.params.id}`,
      css: ["style.css", "comments.css"],
    });
  }
);

router.get("/search", async function (req, res, next) {
  var { searchValue } = req.query;
  try {
    var [rows, _] = await db.execute(
      `select id,title,thumbnail, concat_ws(' ', title, description) as haystack
      from posts
      having haystack like ?;`,
      [`%${searchValue}%`]
    );

    if (rows && rows.length == 0) {
    } else {
      res.locals.posts = rows;
      return res.render("index", {
        title: "CSC 317 App",
        name: "Riel Orque",
        css: ["style.css"],
        js: ["fetchindex.js"],
      });
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/delete/:id(\\d+)", isLoggedIn, async function (req, res, next) {
  var postId = req.params.id;
  try {
    var [resultObject, _] = await db.execute(
      `DELETE FROM posts
      WHERE id = ?
      AND fk_userId = ?`,
      [postId, req.session.user.userId]
    );

    if (resultObject && resultObject.affectedRows > 0) {
      req.json({ message: "Post deleted." });
    } else {
      res.status(400).json({ error: "Failed. Post not deleted." });
    }
  } catch (error) {
    next(error);
  }
});

// router.put("/", function(req,res,next){});
// router.patch("/", function(req,res,next){});

module.exports = router;
