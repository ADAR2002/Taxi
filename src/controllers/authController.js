const User = require('../models/User');
const Employee = require('../models/Employee');
const Driver = require('../models/Driver');
const jwt = require('jsonwebtoken');
const checkUser = require('../service/userService');
/**
 * @desc Create new user
 * @route /register
 * @method post
 * @access public
 */


exports.register = async (req, res) => {
    try {
        const user = new User({
            userName: req.body.userName,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role,
        })
        const check = await checkUser.checkUserIsTaken(user.email, user.phone, user.userName);
        if (check) {
            return res.status(500).json({
                success: false,
                message: "User already exists"
            });
        }
        const result = await user.save();
        res.status(201).json(result);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "somthing wrong",
            error: error.message
        });
    }
}

/**
 * @desc login user
 * @route /login
 * @method post
 * @access public
 */


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email, password })
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'email or password is wrong'
            });
        }
        const role = user.role;
        if(user.role == "driver"){
            const x = user;
            user = await Driver.findOne( {user:user._id});
            user.user = x;
        }else if(user.role == "employee"){
            const x = user;
            user = await Employee.findOne({user:user._id});
            user.user = x;
        }
        const token = jwt.sign({ id: user._id, role: role }, process.env.JWT_SECRET);
        res.status(200).json({ token, user });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Something wrong ', error: error.message });
    }
}