const Employee = require('../models/Employee');
const User = require('../models/User');
const JobRole = require('../models/JobRole');
const checkUser = require('../service/userService');
/**
 * @desc Create new user
 * @route /apply
 * @method post
 * @access public
 */


exports.apply = async (req, res) => {
    try {
        const user = {
            userName: req.body.userName,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
            email: req.body.email,
            password: req.body.password,
        };
        let isUserHere = await User.findOne(user);
        //console.log(isUserHere);
        const jobRoleId = req.body.jobRoleId;
        const isJobRoleHere = await JobRole.findById(jobRoleId);
        if (!isJobRoleHere) {
            return res.status(400).json(
                {
                    success: false,
                    message: 'JobRole is not found'
                }
            );
        }
        if (!isUserHere) {
            isUserHere = new User({
                userName: user.userName,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                email: user.email,
                password: user.password,
                role: 'employee'
            });
            const check = await checkUser.checkUserIsTaken(user.email, user.phone, user.userName);
            console.log(check);
            if (check) {
                return res.status(500).json({
                    success: false,
                    message: "User already exists"
                });
            }
            isUserHere = await isUserHere.save();
        }
        employee = new Employee({
            user: isUserHere.id,
            jobRole: isJobRoleHere.id
        });
        const check = await checkUser.checkEmployeeIsTaken(employee.user);
        if (check) {
            return res.status(500).json({
                success: false,
                message: "User already exists"
            });
        }
        const result = await employee.save();
        res.status(201).json(result);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: true,
            message: 'Something wrong ',
            error: error.message,
        }
        );
    }
}

/**
 * @desc approve employee
 * @route /approve/:id
 * @method put
 * @access public
 */


exports.approve = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            { status: 'Aproved' },
        ).populate('user', 'userName firstName lastName email');
        if (!employee) {
            return res.status(404).json(
                {
                    success: false,
                    message: 'employee is not found'
                }
            );
        }
        res.status(201).json(
            {
                success: true,
                message: 'Update done'
            }
        );
    }
    catch (error) {
        console.log(error);
        res.status(500).json(
            {
                success: false,
                message: 'Something wrong ',
                error: error.message,
            }
        );
    }

}


/**
 * @desc delete employee
 * @route /:id
 * @method delete
 * @access public
 */


exports.removeEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee is not found',
                error: error.message,
            });
        }
        console.log(employee);
        const user = await User.findOne(employee.user);
        /// isRoleUsed  
        await employee.deleteOne();
        await user.deleteOne();
        res.status(200).json({
            success: true,
            message: 'Employee is removed'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "somthing wrong",
            error: error.message,
        });
    }

}

/**
 * @desc get all employee
 * @route /
 * @method get
 * @access public
 */

exports.getAllEmployee = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const result = await Employee.find().skip(skip).limit(limit).populate('user', 'userName firstName lastName email').populate('jobRole', 'title');
        console.log(result);
        res.status(200).json({
            success: true,
            count: result.length,
            data: result
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " can't get all Employees",
            error: error.message,
        });
    }
}


/**
 * @desc git employee
 * @route /:id
 * @method get
 * @access public
 */


exports.getEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id).populate('user', 'userName firstName lastName email').populate('jobRole', 'title');
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee is not found'
            });
        }
        /// isRoleUsed  
        res.status(200).json({
            success: true,
            data: employee
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "somthing wrong",
            error: error.message,
        });
    }
} 