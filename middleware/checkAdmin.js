exports.checkAdmin = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'employee') {
        return res.status(403).json({
            success: false,
            message: "you can't do this"
        }
        );
    }
    next();
}