const router = require('express').Router();
const blogRoutes = require('./blogRoutes');
const userRoutes = require('./userRoutes');

router.use('/dashboard', blogRoutes);
router.use('/users', userRoutes);

module.exports = router;
