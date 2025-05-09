const Employee = require('../models/Employee');
const User = require('../models/User');
const JobRole = require('../models/JobRole');

/**
 * @desc Create new user
 * @route /apply
 * @method post
 * @access public
 */

try {
    exports.apply = async (req, res) => {
        const user = {
            userName: req.body.userName,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
            email: req.body.email,
            password: req.body.password,
        };
        let isUserHere = await User.findOne(user);
        console.log(isUserHere);
        const jobRoleId = req.body.jobRoleId;
        const isJobRoleHere = await JobRole.findById(jobRoleId);
        console.log(jobRoleId);
        console.log(isJobRoleHere);

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
            isUserHere = await isUserHere.save();
        }
        employee = new Employee({
            user: isUserHere.id,
            jobRole: isJobRoleHere.id
        });
        const result = await employee.save();
        res.status(201).json(result);
    }
} catch (error) {
    console.log(error);
    res.status(500).json({
        success: true,
        message: 'Something wrong '
    }
    );
}

/**
 * @desc approve employee
 * @route /approve/:id
 * @method put
 * @access public
 */

try {
    exports.approve = async (req, res) => {
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
} catch (error) {
    console.log(error);
    res.status(500).json(
        {
            success: false,
            message: 'Something wrong '
        }
    );
}



/**
 * @desc delete employee
 * @route /:id
 * @method delete
 * @access public
 */

try {
    exports.removeEmployee = async (req, res) => {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: 'Employee is not found'
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
    }
} catch (error) {
    console.log(error);
    res.status(500).json({
        success: false,
        message: "somthing wrong",
        error: error.message,
    });
}


/**
 * @desc get all employee
 * @route /
 * @method get
 * @access public
 */
try {
    exports.getAllEmployee = async (req, res) => {
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
} catch (error) {
    console.log(error);
    res.status(500).json({
        success: false,
        message: " can't get all Employees",
        error: error.message,
    });
}


/**
 * @desc git employee
 * @route /:id
 * @method get
 * @access public
 */

try {
    exports.getEmployee = async (req, res) => {
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
    }
} catch (error) {
    console.log(error);
    res.status(500).json({
        success: false,
        message: "somthing wrong",
        error: error.message,
    });
}