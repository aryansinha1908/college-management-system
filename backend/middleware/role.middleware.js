const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        // console.log("Role Middleware Start");
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

        // console.log("Role Middleware Confirmed");
        next();
    }
}

module.exports = roleMiddleware;
