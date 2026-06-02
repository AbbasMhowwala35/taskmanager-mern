// Must be chained AFTER the protect middleware
export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        return next();
    }
    return res.status(403).json({
        status: "error",
        message: "Access denied. Admins only.",
        data: null
    });
};
