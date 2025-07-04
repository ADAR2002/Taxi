const Driver = require('../models/Driver');
const User = require('../models/User');

/**
 * @desc Create new driver
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
        if (!isUserHere) {
            isUserHere = new User({
                userName: user.userName,
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                email: user.email,
                password: user.password,
                role: 'driver'
            });
            isUserHere = await isUserHere.save();
        }
        driver = new Driver({
            user: isUserHere.id,
            licenseNumber:req.body.licenseNumber,
            vehicleType:req.body.vehicleType,
            vehicleSize:req.body.vehicleSize,
        });
        const result = await driver.save();
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
 * @desc approve driver
 * @route /approve/:id
 * @method put
 * @access public
 */

try {
    exports.approve = async (req, res) => {
        const driver = await Driver.findByIdAndUpdate(
            req.params.id,
            { status: 'Aproved' },
        ).populate('user', 'userName firstName lastName email');
        if (!driver) {
            return res.status(404).json(
                {
                    success: false,
                    message: 'driver is not found'
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
 * @desc change isAvailable
 * @route /availablility/:id
 * @method put
 * @access public
 */

try {
    exports.availablility = async (req, res) => {
        const driver = await Driver.findByIdAndUpdate(
            {user:req.user._id},
            { isAvailable: req.body.isAvailable },
            { new: true },
        )
        if (!driver) {
            return res.status(404).json(
                {
                    success: false,
                    message: 'driver is not found'
                }
            );
        }
        /*
            SEND EMAIL TO DRIVER HE IS APPROVE
        */
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
 * @desc delete driver
 * @route /:id
 * @method delete
 * @access public
 */

try {
    exports.removeDriver = async (req, res) => {
        const driver = await Driver.findById(req.params.id);
        if (!driver) {
            return res.status(404).json({
                success: false,
                message: 'driver is not found'
            });
        }
        const user = await User.findOne(driver.user);
        /// isRoleUsed  
        await driver.deleteOne();
        await user.deleteOne();
        res.status(200).json({
            success: true,
            message: 'Driver is removed'
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
 * @desc get all drivers
 * @route /
 * @method get
 * @access public
 */
try {
    exports.getAllDriver = async (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const result = await Driver.find().skip(skip).limit(limit).populate('user', 'userName firstName lastName email');
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
        message: " can't get all drivers",
        error: error.message,
    });
}


/**
 * @desc get driver
 * @route /:id
 * @method get
 * @access public
 */

try {
    exports.getDriver = async (req, res) => {
        const driver = await Driver.findById(req.params.id).populate('user', 'userName firstName lastName email');
        if (!driver) {
            return res.status(404).json({
                success: false,
                message: 'Driver is not found'
            });
        }
        /// isRoleUsed  
        res.status(200).json({
            success: true,
            data: driver
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