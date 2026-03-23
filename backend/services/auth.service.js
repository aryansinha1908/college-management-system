const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user.model');
const PasswordToken = require('../models/passwordToken.model');
const RefreshToken = require('../models/refreshToken.model');

const generateAccessToken= (user) => {
    const token = jwt.sign({
        userId: user._id,
        role: user.role
    }, process.env.JWT_SECRET, {expiresIn: '30m'});
    console.log("AccessToken generated");
    return token;
}

const generateRefreshToken= (user) => {
    const token = jwt.sign({
        userId: user._id,
        role: user.role
    }, process.env.JWT_SECRET, {expiresIn: '7d'});
    console.log("RefreshToken generated");
    return token;
}

exports.loginUser = async (rollno, password) => {
    console.log("Start of authService.login");
    console.log("DB readyState:", mongoose.connection.readyState);
    const user = await User.findOne({ rollno: rollno });

    if (!user) {
        throw new Error("Invalid credentials");
    }

    console.log("User exists");
    console.log(user.password);
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
        throw new Error("Invalid credentials");
    }

    if (!user.isVerified){
        throw new Error("Please verify your email");
    }
    console.log("meow");

    if (user.twoFactorEnabled) {
        return {
            requiresTwoFactor: true,
            userId: user._id,
            message: "Please complete 2FA process"
        };
    }

    console.log("authService.login Validates");
    
    const refreshToken = await RefreshToken.create({
        userId: user._id,
        token: generateRefreshToken(user),
        expiresAt: new Date(Date.now() + 1000*60*60*24*7)
    });
    const accessToken = generateAccessToken(user);

    return {
        requiresTwoFactor: false,
        accessToken: accessToken,
        refreshToken: refreshToken.token,
        user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    };
}

exports.setPassword = async (token, password) => {
    const passwordToken = await PasswordToken.findOne({ token });

    if (!passwordToken || !passwordToken.userId) {
        throw new Error("Invalid Token");
    }

    const user = await User.findOne( {_id: passwordToken.userId });

    if (!user) {
        throw new Error("User does not Exist");
    }

    if (user.isVerified === true) {
        throw new Error("User is already Registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updated = await User.updateOne( {_id: passwordToken.userId }, { $set: {password: hashedPassword, isVerified: true} });
    const deleted = await PasswordToken.deleteOne( { _id: passwordToken._id});

    return {
        user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    }
}

exports.resetToken = async (refreshToken) => {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    if (!decoded) {
        throw new Error("Invalid Token");
    }

    const token = await RefreshToken.findOne({ token : refreshToken });

    if (!token) {
        throw new Error("Invalid or expired Token");
    }

    if (token.expiresAt.getTime() < Date.now()) {
        throw new Error("Invalid or expired Token");
    }

    const user = await User.findOne({ _id: token.userId });

    if (!user) {
        throw new Error("Invalid or expired Token");
    }

    const newAccessToken = generateAccessToken(user);

    const deletedRefreshToken = await RefreshToken.deleteOne({ token: refreshToken });

    const newRefreshToken = await RefreshToken.create({
        userId: user._id,
        token: generateRefreshToken(user),
        expiresAt: new Date(Date.now() + 1000*60*60*24*7)
    });

    return {
        newAccessToken: newAccessToken || undefined,
        newRefreshToken: newRefreshToken.token,
        user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    }
}
