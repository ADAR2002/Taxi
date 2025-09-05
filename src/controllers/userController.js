const User = require('../models/User');
const Trip = require('../models/trip');
/**
 * @desc get all user
 * @route /
 * @method get
 * @access public
 */

exports.getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const result = await User.find().skip(skip).limit(limit);
        res.status(200).json({
            success: true,
            count: result.length,
            data: result
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " can't get all Users",
            error: error.message,
        });
    }
}


/**
 * @desc get user
 * @route /:id
 * @method get
 * @access public
 */


exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User is not found'
            });
        }
        /// isRoleUsed  
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
} 

/**
 * @desc get trips for user
 * @route /trips/:id
 * @method get
 * @access public
 */


exports.getTripsForUser = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const trips = await Trip.find({userID : req.params.id}).skip(skip).limit(limit);
        res.status(200).json({
            success: true,
            data: trips
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