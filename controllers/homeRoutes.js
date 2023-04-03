const router = require('express').Router();
const { Blog, User } = require('../models');
const withAuth = require('../utils/auth');


// need get routes for '/' '/blog/:id' '/profile' and '/login'
module.exports = router;