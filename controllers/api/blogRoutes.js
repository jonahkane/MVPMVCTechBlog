const router = require('express').Router();
const { Blog, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

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

// router.get("/", (req, res) => {
//   Blog.findAll({
//           attributes: ["id", "content", "title", "created_at"],
//           order: [
//               ["created_at", "DESC"]
//           ],
//           include: [{
//                   model: User,
//                   attributes: ["username"],
//               },
//               {
//                   model: Comment,
//                   attributes: ["id", "comment_text", "blog_id", "user_id", "created_at"],
//                   include: {
//                       model: User,
//                       attributes: ["username"],
//                   },
//               },
//           ],
//       })
//       .then((blogData) => res.json(blogData))
//       .catch((err) => {
//           console.log(err);
//           res.status(500).json(err);
//       });
// });
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

// router.get("/:id", (req, res) => {
//   Blog.findOne({
//           where: {
//               id: req.params.id,
//           },
//           attributes: ["id", "content", "title", "created_at"],
//           include: [{
//                   model: User,
//                   attributes: ["username"],
//               },
//               {
//                   model: Comment,
//                   attributes: ["id", "comment_text", "blog_id", "user_id", "created_at"],
//                   include: {
//                       model: User,
//                       attributes: ["username"],
//                   },
//               },
//           ],
//       })
//       .then((blogData) => {
//           if (!blogData) {
//               res.status(404).json({
//                   message: "No blog found with this id"
//               });
//               return;
//           }
//           res.json(blogData);
//       })
//       .catch((err) => {
//           console.log(err);
//           res.status(500).json(err);
//       });
// });

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

// router.post("/", withAuth, (req, res) => {
//   console.log("creating");
//   Blog.create({
//           title: req.body.title,
//           content: req.body.blog_content,
//           user_id: req.session.user_id
//       })
//       .then((blogData) => res.json(blogData))
//       .catch((err) => {
//           console.log(err);
//           res.status(500).json(err);
//       });
// });

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
  
// router.put("/:id", withAuth, (req, res) => {
//   Blog.update({
//           title: req.body.title,
//           content: req.body.blog_content,
//       }, {
//           where: {
//               id: req.params.id,
//           },
//       })
//       .then((blogData) => {
//           if (!blogData) {
//               res.status(404).json({
//                   message: "No blog found with this id"
//               });
//               return;
//           }
//           res.json(blogData);
//       })
//       .catch((err) => {
//           console.log(err);
//           res.status(500).json(err);
//       });
// });

// router.delete("/:id", withAuth, async (req, res) => {
//     try {
//         const blogData = await Blog.findOne({
//             where: {
//                 id: req.params.id,
//                 user_id: req.params.user_id
//             }
//         });
//         if (!blogData) {
//             res.status(404).json({
//                 message: "No blog with this id"
//             });
//             return;
//         }

//         await Blog.destroy({
//             where: { id: req.params.id }
//         })
//         res.status(200).json({ 
//             message: "Blog has been deleted"
//         });
//     } catch (err) {
//         console.log(err);
//         res.status(500).json(err);
//     }
// });
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
