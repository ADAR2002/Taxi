const User = require('../models/User');
const jwt = require('jsonwebtoken');
const checkUser = require('../service/userService');
/**
 * @desc Create new user
 * @route /register
 * @method post
 * @access public
 */

try {
    exports.register = async (req, res) => {

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
} catch (error) {
    console.log(error);
    res.status(500).json({
        success: false,
        message: "somthing wrong"
    });
}

/**
 * @desc login user
 * @route /login
 * @method post
 * @access public
 */

try {
    exports.login = async (req, res) => {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password })
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'email or password is wrong'
            });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
        res.status(200).json({ token, user });
    }
} catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something wrong ' });
}