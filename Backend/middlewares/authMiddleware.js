import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Verify JWT and attach user to req
export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({
            status: "error",
            message: "Not authorized. No token provided.",
            data: null
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({
                status: "error",
                message: "User no longer exists.",
                data: null
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            status: "error",
            message: "Token is invalid or expired.",
            data: null
        });
    }
};
