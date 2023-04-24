const router = require('express').Router();
const { User, Blog, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

//get all users
router.get("/", async (req, res) => {
    try {
        const userData = await User.findAll({
        attributes: {
            exclude: ['password']
        }
    });
    res.json(userData);
} catch (err) {
    console.log(err);
    res.status(500).json(err);
}
});
 
//get one user
router.get("/:id", async (req, res) => {
    try {
        const userData = await User.findOne({
            attributes: {
                exclude: ['password']
            },
            where: {
                id: req.params.id
            },
            include: [{
                model: Blog,
                attributes: ['id', 'title', 'content', 'created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                    model: Blog,
                    attributes: ['title']
                }
            }
        ]
        });
        if (!userData){
            res.status(404).json({
                message: "no user found with this id"
            });
            return;
        }
        res.json(userData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});
 

//creating a new user
router.post('/', (req, res) => {
  User.create({
          username: req.body.username,
          password: req.body.password
      })
      .then(userData => {
          req.session.save(() => {
              req.session.user_id = userData.id;
              req.session.username = userData.username;
              req.session.loggedIn = true;

              res.json(userData);
          });
      })
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
})


//logging in as user
router.post("/login", async (req, res) => {
    try {
        const userData = await User.findOne({
            where: { 
                username: req.body.username
            }
        });

        if (!userData) {
            res.status(400).json({
                message: "No user with that user name!"
            });
            return;
        }

        const validPassword = await bcrypt.compare(
            req.body.password, 
            userData.password
        )
        if (!validPassword) {
            res.status(400).json({
                message: 'Incorrect password!'
            });
            return;
        }
        req.session.save(() => {
            req.session.loggedIn = true;
            req.session.user_id = userData.id;
            req.session.username = userData.username;
            
            res.status(200).json({ user: userData, message: "You are now logged in."});
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});
 
//route to log user out
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
      req.session.destroy(() => {
        res.status(204).end();
      });
    } else {
      res.status(404).end();
    }
  });
  
module.exports = router;
