import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";

// Helper: create signed JWT
const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d"
    });

// Helper: build standard success response with user + token
const sendAuthResponse = (res, statusCode, user, message) => {
    const token = signToken(user._id);
    res.status(statusCode).json({
        status: "success",
        message,
        data: {
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        }
    });
};

// POST /api/auth/register
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                status: "error",
                message: "Please provide name, email and password.",
                data: null
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                status: "error",
                message: "An account with this email already exists.",
                data: null
            });
        }

        const user = await User.create({ name, email, password, role: "user" });
        sendAuthResponse(res, 201, user, "Account created successfully.");
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message, data: null });
    }
};

// POST /api/auth/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: "error",
                message: "Please provide email and password.",
                data: null
            });
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({
                status: "error",
                message: "Invalid email or password.",
                data: null
            });
        }

        sendAuthResponse(res, 200, user, "Logged in successfully.");
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message, data: null });
    }
};

// POST /api/auth/admin/login  (admin-specific login — same logic, but role check)
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: "error",
                message: "Please provide email and password.",
                data: null
            });
        }

        const user = await User.findOne({ email }).select("+password");
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({
                status: "error",
                message: "Invalid email or password.",
                data: null
            });
        }

        if (user.role !== "admin") {
            return res.status(403).json({
                status: "error",
                message: "Access denied. You are not an admin.",
                data: null
            });
        }

        sendAuthResponse(res, 200, user, "Admin logged in successfully.");
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message, data: null });
    }
};

// GET /api/auth/me  (get current logged-in user)
export const getMe = async (req, res) => {
    try {
        res.status(200).json({
            status: "success",
            message: "User fetched successfully.",
            data: req.user
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message, data: null });
    }
};

// POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ status: "error", message: "Please provide your email.", data: null });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: "error", message: "No account found with that email.", data: null });
        }

        // Generate a random reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
        await user.save({ validateBeforeSave: false });

        // In production you would email the token. For now, return it in dev mode.
        res.status(200).json({
            status: "success",
            message: "Password reset token generated. In production this would be emailed.",
            data: {
                resetToken   // expose plaintext token (SHA256 of this is stored in DB)
            }
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message, data: null });
    }
};

// POST /api/auth/reset-password/:token
export const resetPassword = async (req, res) => {
    try {
        const { password } = req.body;
        const hashedToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ status: "error", message: "Token is invalid or has expired.", data: null });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        sendAuthResponse(res, 200, user, "Password reset successfully.");
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message, data: null });
    }
};
