const bcrypt = require("bcrypt");
const cookie = require("cookie-parser");
const jwt = require("jsonwebtoken");
const authService = require("../services/auth.service");

exports.register = async (req, res, next) => {
    const { name, password } = req.body;
}

exports.login = async (req, res, next) => {
    try{
        const { rollno, password } = req.body;

        if (!rollno|| !password){
            return res.status(400).json({ message: "Roll number and Password are required" });
        }

        console.log(rollno + " " + password);
        const result = await authService.loginUser(rollno, password);

        res.cookie("accessToken", result.accessToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: 'lax', maxAge: 60 * 30 * 1000});
        res.cookie("refreshToken", result.refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: 'lax', maxAge: 60 * 60 * 24 * 7 * 1000});

        return res.status(200).json({
            success: true,
            data: result
        })
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid credentials",
            error: error
        })
    }
};

exports.logout = async (req, res, next) => {
    try{
        const refreshToken = req.cookies?.refreshToken;

        await authService.logout(refreshToken);

        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'lax'
        });

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'lax'
        });

        return res.status(200).json({
            success: true,
            message: "User has been logged out",
        });
    } catch (error) {
        return {
            success: false,
            message: "Unable to logout",
            error: error
        }
    }
}

exports.setPassword = async (req, res, next) => {
    try {
        const { password, confirmPassword, token } = req.body;

        if (password !== confirmPassword){
            return res.status(400).json({
                message: "Password and Confirm Password must be same"
            })
        }

        if (!token){
            return res.status(400).json({
                success: false,
                message: "Invalid Link"
            })
        }

        const result = await authService.setPassword(token, password);

        return res.status(200).json({
            success: true,
            data: result
        })
    } catch (error){
        return res.status(400).json({
            success: false,
            message: "Password could not be set"
        })
    }
}

exports.forgotPassword = async (req, res, next) => {
    return;
}
exports.resetPassword = async (req, res, next) => {
    return;
}
exports.sendOtp = async (req, res, next) => {
    return;
}
exports.verifyOtp = async (req, res, next) => {
    return;
}

exports.resetToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            return res.status(404).json({
                success: false,
                message: "Refresh Token not Found"
            })
        }
        const reset = await authService.resetToken(refreshToken);

        res.cookie('refreshToken', reset.newRefreshToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: 'lax', maxAge: 60 * 60 * 24 * 7 * 1000});
        res.cookie('accessToken', reset.newAccessToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: 'lax', maxAge: 60 * 30 * 1000});

        return res.status(200).json({
            success: true,
            message: "refreshToken and accessToken have been refreshed"
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Token could not be Refreshed",
            error: error
        })
    }
}
