const router = require('express').Router();
const { Blog, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');


//get all blog entries
router.get("/", async (req,res) => {
    try {
        const blogData = await Blog.findAll({
            attributes: ["id", "content", "title", "created_at"],
            order: [
                ["created_at", "DESC"]
            ],
            include: [
                { 
                    model: User,
                    attributes: ["username"],
                },
                {
                    modle: Comment,
                    attributes: ["id", "comment_text", "blog_id", "user_id", "created_at"],
                    include: {
                        model: User,
                        attributes: ["username"],
                    },
                },
            ],
        });
        res.json(blogData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

//get one specific blog entry
router.get("/:id", async (req, res) => {
    try {
        const blogData = await Blog.findOne({
            where: {
                id: req.params.id,
            },
            attributes: ["id", "content", "title", "created_at"],
            include: [
                {
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
        });
        if (!blogData) {
            res.status(404).json({
                message: "No blog with this id"
            });
            return;
        }
        res.json(blogData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

//create new blog
router.post("/", withAuth, async (req, res) => {
try {
    const blogData = await Blog.create({
        title: req.body.title,
        content: req.body.blog_content,
        user_id: req.session.user_id
    });
    res.json(blogData)
} catch (err) {
    console.log(err);
    res.status(500).json(err);
}
});

//update existing blog
router.put("/:id", withAuth, async (req, res) => {
    try {
        const blogData = await Blog.update(
            {
                title: req.body.title,
                content: req.body.blog_content,      
            },
            {
                where: {
                id: req.params.id,
            },
        });
        if (!blogData) {
            res.status(404).json({
                message: "No blog found with this id",
            });
            return;
        }
        res.json(blogData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});
  
//delete existing blog
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
