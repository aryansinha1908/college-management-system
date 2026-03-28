const bcrypt = require("bcrypt");
const cookie = require("cookie-parser");
const jwt = require("jsonwebtoken");
const authService = require("../services/auth.service");

exports.register = async (req, res, next) => {
    try {
        const data = req.body;

        // console.log(data);
        if (!data.name || !data.email || !data.password || !data.role) {
            return res.status(400).json({
                success: false,
                message: "Invalid Data"
            })
        }

        if (data.role === "admin") {
            return res.status(400).json({
                success: false,
                message: "Invalid Data"
            })
        }

        const registered = await authService.register(data);

        return res.status(201).json({
            success: true,
            message: "User has been registered",
            createdUser: registered.newUser,
            passwordToken: registered.passwordToken
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "User Could Not be Registered",
            error: error.message
        })
    }
}

exports.login = async (req, res, next) => {
    try{
        const { email, password } = req.body;

        if (!email || !password){
            return res.status(400).json({ message: "Email and Password Are Required" });
        }

        const refreshToken = req.cookies?.refreshToken;

        // console.log(email + " " + password);
        const result = await authService.loginUser(email, password, refreshToken);

        res.cookie("accessToken", result.accessToken || null, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: 'lax', maxAge: 60 * 30 * 1000});
        res.cookie("refreshToken", result.refreshToken || null, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: 'lax', maxAge: 60 * 60 * 24 * 7 * 1000});

        return res.status(200).json({
            success: true,
            data: result
        })
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid Credentials",
            error: error.message
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
            error: error.message
        }
    }
}

exports.setPassword = async (req, res, next) => {
    try {
        const { password, confirmPassword } = req.body;
        const token = req.query.token;

        console.log(token);

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
            message: "Password could not be set",
            error: error.message
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
    try {
        const email  = req.body.email;

        const otp = await authService.sendOtp(email);

        return res.status(200).json({
            success: true,
            message: "OTP Sent Successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "2FA  Failed",
            error: error.message
        })
    }
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
            error: error.message
        })
    }
}
