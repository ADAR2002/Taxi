exports.checkAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: "you can't do this"
        }
        );
    }
    next();
}