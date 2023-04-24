const router = require('express').Router();
const sequelize = require('../config/connection');
const { Blog, User, Comment } = require('../models');


//find all blog entries
router.get("/", async (req, res) => {
    try {
        const blogData = await Blog.findAll({
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

    res.render('homepage', {
        blogs,
        loggedIn: req.session.loggedIn
    });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});


//find one blog entry
router.get("/blog/:id", async (req, res) => {
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
            res.status(4040).json({
                message: "No blog found with this is"
            });
            return;
        }

        const blog = blogData.get({
            plain: true
        });
        
        res.render('single-post', {
            blog,
            loggedIn: req.session.loggedIn
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});


//log in route
router.get("/login", async (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    try {
        res.render('login');
    }   catch (err) {
        console.log(err);
        res.status(500).send('Server errror');
    }
});


//signup route
router.get('/signup', async (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    try {
        res.render('signup');
    }   catch (err) {
        console.log(err);
        res.status(500).send("server error.");
    }
});

module.exports = router;
