const express = require('express');
const router = express.Router();
const jobRoleController = require('../controllers/jobRoleController');
const checkAdmin = require('../middleware/checkAdmin');
const dec = require('../middleware/auth');


router.post('/add-role', dec.authMiddleware, checkAdmin.checkAdmin, jobRoleController.addRole);
router.get('/', jobRoleController.getAllRoles);
router.delete('/:id', dec.authMiddleware, checkAdmin.checkAdmin, jobRoleController.removeRole);
module.exports = router;
