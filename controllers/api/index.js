const router = require('express').Router();
const dashboardRoutes = require('./dashboardRoutes');
const userRoutes = require('./userRoutes');

router.use('/dashboard', dashboardRoutes);
router.use('/users', userRoutes);

module.exports = router;
