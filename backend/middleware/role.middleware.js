const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const role = req.user.role;

        if (!allowedRoles.includes(role)) {
            return res.status(403).json({
                success: false,
                message: "Forbidden"
            });
        }

        next();
    }
}

module.exports = roleMiddleware;
