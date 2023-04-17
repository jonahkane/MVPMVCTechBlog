const router = require('express').Router();
const { Blog, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

router.get("/", (req, res) => {
  Blog.findAll({
          attributes: ["id", "content", "title", "created_at"],
          order: [
              ["created_at", "DESC"]
          ],
          include: [{
                  model: User,
                  attributes: ["username"],
              },
              {
                  model: Comment,
                  attributes: ["id", "comment_text", "blog_id", "user_id", "created_at"],
                  include: {
                      model: User,
                      attributes: ["username"],
                  },
              },
          ],
      })
      .then((blogData) => res.json(blogData))
      .catch((err) => {
          console.log(err);
          res.status(500).json(err);
      });
});

router.get("/:id", (req, res) => {
  Blog.findOne({
          where: {
              id: req.params.id,
          },
          attributes: ["id", "content", "title", "created_at"],
          include: [{
                  model: User,
                  attributes: ["username"],
              },
              {
                  model: Comment,
                  attributes: ["id", "comment_text", "blog_id", "user_id", "created_at"],
                  include: {
                      model: User,
                      attributes: ["username"],
                  },
              },
          ],
      })
      .then((blogData) => {
          if (!blogData) {
              res.status(404).json({
                  message: "No blog found with this id"
              });
              return;
          }
          res.json(blogData);
      })
      .catch((err) => {
          console.log(err);
          res.status(500).json(err);
      });
});

router.post("/", withAuth, (req, res) => {
  console.log("creating");
  Blog.create({
          title: req.body.title,
          content: req.body.blog_content,
          user_id: req.session.user_id
      })
      .then((blogData) => res.json(blogData))
      .catch((err) => {
          console.log(err);
          res.status(500).json(err);
      });
});

router.put("/:id", withAuth, (req, res) => {
  Blog.update({
          title: req.body.title,
          content: req.body.blog_content,
      }, {
          where: {
              id: req.params.id,
          },
      })
      .then((blogData) => {
          if (!blogData) {
              res.status(404).json({
                  message: "No blog found with this id"
              });
              return;
          }
          res.json(blogData);
      })
      .catch((err) => {
          console.log(err);
          res.status(500).json(err);
      });
});

router.delete("/:id", withAuth, (req, res) => {
  Blog.destroy({
          where: {
              id: req.params.id,
          },
      })
      .then((blogData) => {
          if (!blogData) {
              res.status(404).json({
                  message: "No blog found with this id"
              });
              return;
          }
          res.json(blogData);
      })
      .catch((err) => {
          console.log(err);
          res.status(500).json(err);
      });
});

module.exports = router;
