const router = require('express').Router();
const { Blog, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
    try {
        const blogData = await Blog.findAll({
            inclue: [
                {
                    model: User,
                    attributes: ['name'],
                },
            ],
        });
        const blogs = blogData.map((blog) => blog.get({ plain: true }));

        res.render('homepage', {
            blogs,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/blog/:id', async (req, res) => {
    try {
        const blogData = await Blog.findByPk(req.params.id, {
    include: [
        {
            model: User,
            attributes: ['name'],
        },
    ],
});

const blog = blogData.get({ plain: true });

res.render('blog', {
    ...Blog,
    logged_in: req.session.logged_in
});
} catch (err) {
    res.status(500).json(err);
}
});

router.get('/profile', withAuth, async (req, res) => {
    try {
        const userData = await User.findByPk(req.session.user_id, {
            attributes: { exclude: ['password']},
            include: [{ model: Blog }],
        });
        
        const user = userData.get({ plain: true });

        res.render('profile', {
            ...user,
            logged_in: true
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// need get routes for '/' '/blog/:id' '/profile' and '/login'
module.exports = router;