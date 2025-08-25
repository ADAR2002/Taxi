const JobRole = require('../models/JobRole');
/**
 * @desc Create new Role
 * @route /add-role
 * @method post
 * @access public
 */

exports.addRole = async (req, res) => {
    try {
        const role = new JobRole({
            title: req.body.title,
            description: req.body.description,
            roles: req.body.roles,
            createdBy: req.user.id
        })
        await role.save();
        res.status(201).json({
            success: true,
            message: 'successful add new role',
        }
        );
    } catch (error) {
        console.log(error);
        res.status(500).json(
            {
                success: false,
                message: 'This Role is already exists or somthing wrong',
                error: error.message,
            }
        );
    }
}


/**
 * @desc get all Role
 * @route /
 * @method get
 * @access public
 */

exports.getAllRoles = async (req, res) => {
    try {
        const result = await JobRole.find().populate('createdBy', 'userName firstName lastName email');
        console.log(result);
        res.status(200).json({
            success: true,
            count: result.length,
            data: result
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: " can't get all roles",
            error: error.message,
        });
    }

}
/**
 * @desc delete Role
 * @route /:id
 * @method delete
 * @access public
 */


exports.removeRole = async (req, res) => {
    try {
        const role = JobRole.findById(req.params.id);
        if (!role) {
            return res.status(404).json({
                success: false,
                message: 'Role is not found'
            });
        }
        /// isRoleUsed  
        await role.deleteOne();
        res.status(200).json({
            success: true,
            message: 'Role is removed'
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