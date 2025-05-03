const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeContoller');


router.post('/apply', employeeController.apply);
router.put('/approve/:id', employeeController.approve);
router.delete('/:id',employeeController.removeEmployee);
router.get('/:id',employeeController.getEmployee);
router.get('/',employeeController.getAllEmployee);

module.exports = router;
