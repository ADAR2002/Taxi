const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "login required"
        })
    }
    try {
        const dec = jwt.verify(token, process.env.JWT_SECRET);
        req.user = dec;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "something wronge",
            error: err.message
        })
    }

}