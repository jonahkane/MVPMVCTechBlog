const router = require('express').Router();
const sequelize = require('../config/connection');
const {
    Blog,
    User,
    Comment
} = require('../models');   
const withAuth = require('../utils/auth');

//find all blog entries
router.get("/", withAuth, async (req, res) => {
    try {
        const blogData = await Blog.findAll({
            where: {
                user_id: req.session.user_id
            },
            attributes: [
                'id',
                'title',
                'content',
                'created_at'
            ],
            include: [{
                    model: Comment,
                    attributes: ['id', 'comment_text', 'blog_id', 'user_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['username']
                    }
                },
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        });
        const blogs = blogData.map(blog => blog.get({
            plain: true
        }));
        res.render('dashboard', {
            blogs,
            loggedIn: true
        });

    } catch (err) {
        console.log('err');
        res.status(500).json(err);
    }
});

//edit blog entry if logged in and it is "your" entry
router.get("/edit/:id", withAuth, async (req, res) => {
    try {
        const blogData = await Blog.findOne({
            where: {
                id: req.params.id
            },
            attributes: [
                'id',
                'title',
                'content',
                'created_at'
            ],
            include: [{
                    model: Comment,
                    attributes: ['id', 'comment_text', 'blog_id', 'user_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['username']
                    }
                },
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        });
        if (!blogData) {
            res.status(404).json({
                message: "No blog found with this id"
            });
            return;
        }
        const blog = blogData.get({
            plain: true
        });

        res.render('edit-blog', {
            blog,
            loggedIn: true
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});


//create a new blog entry
router.get("/new", async (req, res) => {
    try {
        res.render('add-blog', {
            loggedIn: true
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});



module.exports = router;