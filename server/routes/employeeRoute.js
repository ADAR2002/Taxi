const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeContoller');
const checkAdmin = require('../middleware/checkAdmin');
const dec = require('../middleware/auth');


router.post('/apply', employeeController.apply);
router.put('/approve/:id', dec.authMiddleware, checkAdmin.checkAdmin, employeeController.approve);
router.delete('/:id',dec.authMiddleware, checkAdmin.checkAdmin, employeeController.removeEmployee);
router.get('/:id', employeeController.getEmployee);
router.get('/',dec.authMiddleware, checkAdmin.checkAdmin,employeeController.getAllEmployee);

module.exports = router;
