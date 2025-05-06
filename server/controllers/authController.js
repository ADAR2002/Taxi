const User = require('../models/User');
const jwt = require('jsonwebtoken');
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
            phone:req.body.phone,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role,
        })
        const result = await user.save();
        res.status(201).json(result);
    }
} catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something wrong ' });
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
            return res.status(401).json({ error: 'email or password is wrong' });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
        res.status(200).json({ token, user });
    }
} catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something wrong ' });
}