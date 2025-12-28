export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        const roleName = req.user.role.name;

        if (!allowedRoles.includes(roleName)) {
            return res.status(403).json({ message: "Access denied" });
        }

        next();
    };
};
