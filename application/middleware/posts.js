var pathToFFMPEG = require("ffmpeg-static");
var exec = require("child_process").exec;
var db = require("../conf/database");

module.exports = {
  makeThumbnail: function (req, res, next) {
    if (!req.file) {
      next(new Error("File upload failed"));
    } else {
      try {
        var destinationOfThumbnail = `public/images/uploads/thumbnail-${
          req.file.filename.split(".")[0]
        }.png`;
        var thumbnailCommand = `"${pathToFFMPEG}" -ss 00:00:04 -i ${req.file.path} -y -s 200x200 -vframes 1 -f image2 ${destinationOfThumbnail}`;
        exec(thumbnailCommand);
        req.file.thumbnail = destinationOfThumbnail;
        next();
        // exec(thumbnailCommand, function(error, stdout,stderr){
        //   if(error) next(error);
        //   console.log(stdout);
        //   console.log(stderr);
          //save thumbnail path to req.file
          //call next
        // });
      } catch (error) {
        exec(thumbnailCommand, function (error, stdout, stderr) {
          req.file.thumbnail = destinationOfThumbnail;
          next();
        });
        next(error);
      }
    }
  },
  getPostsForUserBy: function (req, res, next) {},
  getPostById: async function (req, res, next) {
    var { id } = req.params;
    try {
      let [rows, _] = await db.execute(
        `select u.username, p.video, p.title, p.description, p.id, p.createdAt
        from posts p
        JOIN users u
        ON p.fk_userId=u.id
        WHERE p.id=?;`,
        [id]
      );
      const post = rows[0];
      if (!post) {
        // res.locals.currentPost = rows[0];
      } else {
        res.locals.currentPost = post;
        next();
      }
    } catch (error) {
      next(error);
    }
  },
  getCommentsForPostById: async function (req, res, next) {
    var { id } = req.params;
    try {
      let [rows, _] = await db.execute(
        `select u.username, c.text, c.createdAt
        from comments c
        JOIN users u
        ON c.fk_authorId=u.id
        WHERE c.fk_postId=?;`,
        [id]
      );

      res.locals.currentPost.comments = rows;
      next();
    } catch (error) {
      next(error);
    }
  },
  getRecentPosts: async function (req, res, next) {
    try {
      let [rows] = await db.execute(
        `SELECT * FROM csc317db.posts ORDER BY createdAt DESC LIMIT 4;`
      );
      const posts = rows;
      res.locals.recentPosts = posts;
      next();
    } catch (error) {
      next(error);
    }
  },
};
